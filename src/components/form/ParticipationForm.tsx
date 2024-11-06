'use client';

import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { isMemberExist, memberFullChecker, memberFullSwitch, partySituationChecker } from '@/utils/memberCheck';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import partyProfileImageUploader from '@/utils/partyProfileImageUploader';

const ParticipationForm = ({
  party_id,
  closeHandler,
  setMessage
}: {
  party_id: string;
  closeHandler: Dispatch<SetStateAction<boolean>>;
  setMessage: Dispatch<SetStateAction<string>>;
}) => {
  // 스토리지 업로드 이미지 파일
  const imgRef = useRef<HTMLInputElement>(null);

  // 보여주기 이미지
  const [profile_image, setProfile_image] = useState(
    'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/avatar.png'
  );
  const [nickname, setNickname] = useState('익명');
  const [disabled, setDisabled] = useState(false);
  const path = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  // 이미지 업로드 onChange
  const uploadImage = () => {
    const file = imgRef.current?.files?.[0]; // 선택한 파일을 file에 저장
    if (file) {
      // 파일이 있다면
      const reader = new FileReader(); // 1. 사용할 FileReader를 reader에 선언
      reader.readAsDataURL(file); // 2. .readAsDataURL메서드를 사용해 파일을 데이터 URL형식으로 변환
      reader.onloadend = () => {
        // 3. FileReader가 파일을 다 읽고 난 뒤 실행되는 함수
        if (typeof reader.result === 'string') {
          setProfile_image(reader.result); // 4. reader.result는 3에서 읽은 데이터를 담고있음. 이걸 ImgFile에 담아줌
        }
      };
    }
  };

  // 참가하기 함수
  const submitHandler = async () => {
    setDisabled(true);
    const user_Id = await getLoginUserIdOnClient();
    const selectImg = imgRef.current?.files?.[0];
    let upload_profile_img: string = profile_image; // imgFile( uploadImage에서 저장한 이미지정보 )을 profile_img에 선언

    // 로그인하지 않았을 시
    if (!user_Id) {
      setMessage('먼저 로그인해주세요');
      router.push('/login');
      return;
    }

    // 이미 멤버일 때 프로필 변경
    // 오너의 프로필 설정
    const isMember = await isMemberExist(party_id, user_Id);
    console.log('이미 멤버임', isMember);
    if (isMember) {
      // 이미지 업서트하기
      if (selectImg) {
        const newProfileImgURL = await partyProfileImageUploader(selectImg, party_id, user_Id); // 선택된 이미지가있다면 선택된 이미지를 스토리지에 올리고 newProfileImgURL에 선언

        if (newProfileImgURL) {
          upload_profile_img = newProfileImgURL;
        } else if (newProfileImgURL === '') {
          alert('이미지업로드에 실패했습니다');
          upload_profile_img =
            'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/avatar.png';
        }
      }

      // 프로필 업데이트
      const { error: upDateError } = await browserClient
        .from('team_user_profile')
        .update({ nickname, profile_image: upload_profile_img })
        .eq('party_id', party_id)
        .eq('user_id', user_Id);
      if (upDateError) {
        setMessage('프로필 변경을 실패하셨습니다.');
        router.replace(`/party/${party_id}`);
      }
      console.log('프로필 업데이트 에러', upDateError);
      router.replace(`/party/${party_id}`);

      return;
    }

    // 파티 상태 확인하기
    const endCheck = await partySituationChecker(party_id);
    const memberCheck = await memberFullChecker(party_id);
    if (endCheck === '알수없음') {
      setMessage('존재하지 않는 파티입니다');
      return;
    } else if (endCheck === '모집마감') {
      await memberFullSwitch(party_id);
      setMessage('마감된 파티입니다');
      return;
    } else if (endCheck === '종료') {
      setMessage('종료된 파티입니다');
      return;
    } else if (memberCheck && endCheck !== '모집마감') {
      await memberFullSwitch(party_id);
      setMessage('마감된 파티입니다');
      return;
    }

    // 참가하기
    const { error: participationError } = await browserClient
      .from('team_user_profile')
      .insert({ nickname, profile_image: upload_profile_img, party_id });

    if (participationError) {
      setMessage('파티에 참가할 수 없습니다');
      return;
    } else {
      // 선택된 이미지 selectImg에 선언
      if (selectImg) {
        const newProfileImgURL = await partyProfileImageUploader(selectImg, party_id, user_Id); // 선택된 이미지가있다면 선택된 이미지를 스토리지에 올리고 newProfileImgURL에 선언

        if (newProfileImgURL) {
          upload_profile_img = newProfileImgURL;
        } else if (newProfileImgURL === '') {
          alert('이미지업로드에 실패했습니다');
          upload_profile_img =
            'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/avatar.png';
        }
      }
      // 멤버 프로필이미지 업데이트
      const { error } = await browserClient
        .from('team_user_profile')
        .update({ profile_image: upload_profile_img })
        .eq('user_id', user_Id)
        .eq('party_id', party_id);
      if (error) {
        setMessage('이미지 업로드에 실패하셨습니다');

        return;
      }
      // 이 참가하기로 인해 인원이 가득 찼다면 파티 상태를 모집 마감으로 전환
      // 인원이 가득찼는지 확인
      const fullCheck = await memberFullChecker(party_id);
      if (fullCheck) {
        // 모집 마감 상태로 전환
        await memberFullSwitch(party_id);
      }
      // 멤버가 변동하면 바뀌어야 하는 값들
      queryClient.invalidateQueries({ queryKey: ['partyMember', party_id] });
      queryClient.invalidateQueries({ queryKey: ['isMember', party_id, user_Id] });
      queryClient.invalidateQueries({ queryKey: ['myParty', user_Id] });
      setMessage('파티에 참가하신 걸 환영합니다!');
      if (path.includes('/party')) {
        closeHandler(false);
      } else {
        router.replace(`/party/${party_id}`);
      }
    }
    setDisabled(false);
  };

  // 넘어가기
  const skipHandler = async () => {
    setDisabled(true);
    const user_Id = await getLoginUserIdOnClient();

    if (!user_Id) {
      setMessage('먼저 로그인해주세요');
      router.push('/login');
      return;
    }

    // 파티 상태 확인하기
    const endCheck = await partySituationChecker(party_id);
    if (endCheck === '알수없음') {
      setMessage('존재하지 않는 파티입니다');
      return;
    } else if (endCheck === '모집마감') {
      setMessage('마감된 파티입니다');
      return;
    } else if (endCheck === '종료') {
      setMessage('종료된 파티입니다');
      return;
    }

    const isMember = await isMemberExist(party_id, user_Id);
    if (isMember) {
      // setMessage('이미 참가한 파티입니다');
      router.replace(`/party/${party_id}`);

      return;
    }
    const { error: participationError } = await browserClient.from('team_user_profile').insert({
      nickname: '익명',
      profile_image:
        'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/avatar.png',
      party_id
    });

    if (participationError) {
      setMessage('파티에 참가할 수 없습니다');
      return;
    }
    // 멤버가 변동하면 바뀌어야 하는 값들
    queryClient.invalidateQueries({ queryKey: ['partyMember', party_id] });
    queryClient.invalidateQueries({ queryKey: ['isMember', party_id, user_Id] });
    queryClient.invalidateQueries({ queryKey: ['myParty', user_Id] });
    setMessage('파티에 참가하신 걸 환영합니다!');
    setDisabled(false);
  };

  // 이미지 파일 선택
  const buttonClickHandler = () => {
    if (!imgRef.current) return;
    imgRef.current.click();
  };
  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col py-4 items-center gap-4 self-stretch">
          <button type="button" className="relative" onClick={buttonClickHandler}>
            <Image
              src={profile_image}
              alt="프로필 이미지"
              width={80}
              height={80}
              style={{
                objectFit: 'cover',
                width: '80px',
                height: '80px',
                borderRadius: '50%'
              }}
            />
            <div className="flex w-5 h-5 p-[3.33px] items-center absolute right-0 bottom-0 rounded-[15px] bg-Grey-300">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="photo_camera">
                  <mask id="mask0_726_35245" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
                    <rect id="Bounding box" width="16" height="16" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_726_35245)">
                    <path
                      id="photo_camera_2"
                      d="M8.00008 11.4102C8.76508 11.4102 9.41358 11.1442 9.94558 10.6122C10.4776 10.0802 10.7436 9.43171 10.7436 8.66671C10.7436 7.90171 10.4776 7.25321 9.94558 6.72121C9.41358 6.18921 8.76508 5.92321 8.00008 5.92321C7.23508 5.92321 6.58658 6.18921 6.05458 6.72121C5.52258 7.25321 5.25658 7.90171 5.25658 8.66671C5.25658 9.43171 5.52258 10.0802 6.05458 10.6122C6.58658 11.1442 7.23508 11.4102 8.00008 11.4102ZM8.00008 10.4104C7.50775 10.4104 7.09408 10.2428 6.75908 9.90771C6.42397 9.57271 6.25641 9.15904 6.25641 8.66671C6.25641 8.17437 6.42397 7.76071 6.75908 7.42571C7.09408 7.0906 7.50775 6.92304 8.00008 6.92304C8.49241 6.92304 8.90608 7.0906 9.24108 7.42571C9.57619 7.76071 9.74375 8.17437 9.74375 8.66671C9.74375 9.15904 9.57619 9.57271 9.24108 9.90771C8.90608 10.2428 8.49241 10.4104 8.00008 10.4104ZM2.87191 13.6667C2.53514 13.6667 2.25008 13.55 2.01675 13.3167C1.78341 13.0834 1.66675 12.7983 1.66675 12.4615V4.87187C1.66675 4.5351 1.78341 4.25004 2.01675 4.01671C2.25008 3.78337 2.53514 3.66671 2.87191 3.66671H4.90775L6.14108 2.33337H9.85908L11.0924 3.66671H13.1282C13.465 3.66671 13.7501 3.78337 13.9834 4.01671C14.2167 4.25004 14.3334 4.5351 14.3334 4.87187V12.4615C14.3334 12.7983 14.2167 13.0834 13.9834 13.3167C13.7501 13.55 13.465 13.6667 13.1282 13.6667H2.87191ZM2.87191 12.6667H13.1282C13.1881 12.6667 13.2373 12.6475 13.2757 12.609C13.3142 12.5706 13.3334 12.5214 13.3334 12.4615V4.87187C13.3334 4.81199 13.3142 4.76282 13.2757 4.72437C13.2373 4.68593 13.1881 4.66671 13.1282 4.66671H10.6462L9.42308 3.33337H6.57708L5.35391 4.66671H2.87191C2.81203 4.66671 2.76286 4.68593 2.72441 4.72437C2.68597 4.76282 2.66675 4.81199 2.66675 4.87187V12.4615C2.66675 12.5214 2.68597 12.5706 2.72441 12.609C2.76286 12.6475 2.81203 12.6667 2.87191 12.6667Z"
                      fill="white"
                    />
                  </g>
                </g>
              </svg>
            </div>
            <input
              className="hidden"
              id="party_profile"
              type="file"
              ref={imgRef}
              accept="image/*"
              onChange={uploadImage}
            />
          </button>
          <p className="self-stretch text-static-black text-center body-m">파티의 프로필을 설정할 수 있어요</p>
        </div>
        <div className="flex flex-col items-start px-4 self-stretch">
          <input
            className="commonInput px-4 text-center"
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요."
          />
        </div>
      </div>
      <div className="flex flex-col p-4 items-start self-stretch body-m-bold">
        <button onClick={submitHandler} className="btn-l w-full" disabled={disabled}>
          저장
        </button>
        <button className="px-5 py-3 h-12 text-Grey-400 w-full" onClick={skipHandler} disabled={disabled}>
          넘어가기
        </button>
      </div>
    </>
  );
};

export default ParticipationForm;
