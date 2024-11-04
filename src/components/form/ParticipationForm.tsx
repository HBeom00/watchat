'use client';

import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { isMemberExist, memberFullChecker, memberFullSwitch, partySituationChecker } from '@/utils/memberCheck';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';

const ParticipationForm = ({
  party_id,
  closeHandler,
  party_situation,
  setDisplay
}: {
  party_id: string;
  closeHandler: Dispatch<SetStateAction<boolean>>;
  party_situation: string;
  setDisplay: Dispatch<SetStateAction<boolean>>;
}) => {
  const [message, setMessage] = useState<string>('');

  // 스토리지 업로드 이미지 파일
  const imgRef = useRef<HTMLInputElement>(null);

  // 보여주기 이미지
  const [profile_image, setProfile_image] = useState(
    'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/avatar.png'
  );
  const [nickname, setNickname] = useState('익명');
  const [disabled, setDisabled] = useState(false);
  const path = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (party_situation === '모집마감') {
      setMessage('모집이 마감된 파티입니다.');
    }
  }, [party_situation]);

  if (message !== '' && !path.includes('/recruit')) {
    setDisplay(false);
    return (
      <div className="flex flex-col pb-12 justify-center self-stretch items-center body-m text-Grey-900">
        <svg xmlns="http://www.w3.org/2000/svg" width="73" height="64" viewBox="0 0 73 64" fill="none">
          <path
            d="M70.6165 26.9817C69.0493 23.5084 66.6712 20.4829 64.7289 17.1548L64.6744 17.0641C63.2222 14.6134 61.9031 11.7573 60.7776 8.90733C59.3193 5.34934 56.79 -1.39147 51.5014 0.248351C46.0434 1.87607 41.8017 16.2653 35.6902 16.2532C30.3108 16.223 24.8407 1.4283 20.0907 0.266504C12.9808 -1.55485 10.875 11.5093 8.45461 15.636C5.9616 21.1848 2.79693 25.0453 1.23578 30.7151C-4.64579 52.7952 10.8448 63.9956 36.5978 63.9956C68.6862 63.9956 78.0048 42.7687 70.6044 26.9756L70.6165 26.9817ZM28.0296 39.604C25.6213 39.604 24.3748 37.7585 24.3748 35.1263C24.3748 32.9782 25.3914 30.1947 26.8194 28.0466H30.1293C29.1127 29.9285 28.5863 31.3989 28.4713 32.7906C30.2806 32.9056 31.5573 34.1823 31.5573 36.1429C31.5573 38.1034 30.1656 39.604 28.0175 39.604H28.0296ZM36.501 44.9471C35.3997 44.9471 34.5042 44.0515 34.5042 42.9502C34.5042 41.849 35.3997 40.9534 36.501 40.9534C37.6023 40.9534 38.4978 41.849 38.4978 42.9502C38.4978 44.0515 37.6023 44.9471 36.501 44.9471ZM41.4325 35.1263C41.4325 32.9782 42.4491 30.1947 43.8771 28.0466H47.187C46.1705 29.9285 45.644 31.3989 45.5291 32.7906C47.296 32.9056 48.6151 34.1823 48.6151 36.1429C48.6151 38.1034 47.2233 39.604 45.0752 39.604C42.6669 39.604 41.4265 37.7585 41.4265 35.1263H41.4325ZM46.237 52.6318C44.8211 52.6318 43.6714 51.4821 43.6714 50.0662C43.6714 48.9952 45.1357 45.4856 45.8498 43.8276C45.995 43.4888 46.473 43.4888 46.6182 43.8276C47.3323 45.4856 48.7966 49.0012 48.7966 50.0662C48.7966 51.4821 47.6469 52.6318 46.231 52.6318H46.237Z"
            fill="#DCDCDC"
          />
        </svg>
        <p>{message}</p>
      </div>
    );
  }

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
          console.log(reader.result);
          setProfile_image(reader.result); // 4. reader.result는 3에서 읽은 데이터를 담고있음. 이걸 ImgFile에 담아줌
        }
      };
    }
  };

  // 참가하기 함수
  const submitHandler = async () => {
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
      setMessage('이미 참가한 파티입니다');
      router.replace(`/party/${party_id}`);

      return;
    }

    // 참가하기
    const { error: participationError } = await browserClient
      .from('team_user_profile')
      .insert({ nickname, profile_image, party_id });

    if (participationError) {
      setMessage('파티에 참가할 수 없습니다');
      return;
    } else {
      let profile_img = profile_image; // imgFile( uploadImage에서 저장한 이미지정보 )을 profile_img에 선언

      const selectImg = imgRef.current?.files?.[0]; // 선택된 이미지 selectImg에 선언
      if (selectImg) {
        const newProfileImgURL = await uploadStorage(selectImg, party_id, user_Id); // 선택된 이미지가있다면 선택된 이미지를 스토리지에 올리고 newProfileImgURL에 선언

        if (newProfileImgURL) {
          profile_img = newProfileImgURL;
        } else if (newProfileImgURL === '') {
          alert('이미지업로드에 실패했습니다');
          profile_img = 'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/avatar.png';
        }
      }
      // 멤버 프로필이미지 업데이트
      const { error } = await browserClient
        .from('team_user_profile')
        .update({ profile_image: profile_img })
        .eq('user_id', user_Id)
        .eq('party_id', party_id);
      if (error) {
        setMessage('이미지 업로드에 실패하셨습니다');

        return;
      }
      // 이 초대하기로 인해 인원이 가득 찼다면 파티 상태를 모집 마감으로 전환
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
      }
      router.replace(`/party/${party_id}`);
    }
    setDisabled(false);
  };

  // 이미지 파일 선택
  const buttonClickHandler = () => {
    if (!imgRef.current) return;
    imgRef.current.click();
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
      setMessage('이미 참가한 파티입니다');
      router.replace(`/party/${party_id}`);

      return;
    }
    const { error: participationError } = await browserClient.from('team_user_profile').insert({
      nickname: '익명',
      profile_image: 'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/avatar.png',
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
        <button className="px-5 py-3 h-12 text-Grey-400 w-full" onClick={skipHandler}>
          넘어가기
        </button>
      </div>
    </>
  );
};

export default ParticipationForm;

// supabase storage에 이미지 저장
const uploadStorage = async (file: File, party_id: string, user_id: string | null) => {
  const memberIdResponse: PostgrestSingleResponse<{ profile_id: string }[]> = await browserClient
    .from('team_user_profile')
    .select('profile_id')
    .eq('user_id', user_id)
    .eq('party_id', party_id);
  if (!memberIdResponse.data) {
    // console.error('멤버 ID를 가져오는 데 실패했습니다.');
    return ''; // memberId가 유효하지 않으면 빈 문자열 반환
  }

  const profile_image_name = `${memberIdResponse.data[0].profile_id}`;

  const { data, error } = await browserClient.storage.from('team_user_profile_image').upload(profile_image_name, file, {
    cacheControl: 'no-store',
    upsert: true
  });

  if (data) {
    // console.log('supabase에 이미지를 업로드 하는데 성공했습니다.');
    const newImageUrl = browserClient.storage.from('team_user_profile_image').getPublicUrl(profile_image_name)
      .data.publicUrl;

    return newImageUrl;
  }

  if (error) {
    // console.error('supabase에 이미지를 업로드 하는데 실패했습니다.', error.message);
    return '';
  }
};
