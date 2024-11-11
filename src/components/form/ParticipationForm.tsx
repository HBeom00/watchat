'use client';

import { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { isMemberExist } from '@/utils/memberCheck';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDeleteInviteMutation } from '@/store/usdDeleteInvite';
import uploadImage from '@/utils/fileUploader/uploadImage';
import submitParticipation from '@/utils/participation/submitParticipation';
import { useFetchUserData } from '@/store/userStore';
import skipParticipation from '@/utils/participation/skipParticipation';

const ParticipationForm = ({
  party_id,
  setMessage,
  invite_id,
  display
}: {
  party_id: string;
  setMessage: Dispatch<SetStateAction<string>>;
  invite_id?: string;
  display: boolean;
}) => {
  // 초대 삭제 mutation 사용
  const deleteInviteMutation = useDeleteInviteMutation();

  // 스토리지 업로드 이미지 파일
  const imgRef = useRef<HTMLInputElement>(null);

  // 보여주기 이미지
  const [profile_image, setProfile_image] = useState(
    'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/default_profile.png'
  );
  const [nickname, setNickname] = useState('익명');
  const [disabled, setDisabled] = useState(false);
  const path = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const selectImg = imgRef.current?.files?.[0];
  const upload_profile_img: string = profile_image; // imgFile( uploadImage에서 저장한 이미지정보 )을 profile_img에 선언

  const { data } = useFetchUserData();

  useEffect(() => {
    if (data) {
      setNickname(data.nickname);
      setProfile_image(data.profile_img);
    }
  }, [data]);

  // 저장하기 함수
  const submitHandlerMutation = useMutation({
    mutationFn: async () => {
      setDisabled(true);
      const user_Id = await getLoginUserIdOnClient();

      // 로그인하지 않았을 시
      if (!user_Id) {
        alert('먼저 로그인해주세요');
        router.push('/login');
        return;
      }

      await submitParticipation(
        nickname,
        selectImg,
        upload_profile_img,
        party_id,
        user_Id,
        setMessage,
        deleteInviteMutation,
        invite_id
      );

      if (!path.includes('/party')) {
        router.replace(`/party/${party_id}`);
      }

      setDisabled(false);
    },
    onSuccess: async () => {
      const user_Id = await getLoginUserIdOnClient();

      queryClient.invalidateQueries({ queryKey: ['partyOwnerInfo', party_id] });
      queryClient.invalidateQueries({ queryKey: ['partyMember', party_id] });
      queryClient.invalidateQueries({ queryKey: ['isMember', party_id, user_Id] });
      queryClient.invalidateQueries({ queryKey: ['myParty', user_Id] });
      queryClient.invalidateQueries({ queryKey: ['invitedParties', user_Id] });
      queryClient.invalidateQueries({ queryKey: ['memberCount', party_id] });
    }
  });

  // 넘어가기 함수
  const skipHandlerMutation = useMutation({
    mutationFn: async () => {
      setDisabled(true);
      const user_Id = await getLoginUserIdOnClient();
      if (!user_Id) {
        setMessage('먼저 로그인해주세요');
        router.push('/login');
        return;
      }
      const isMember = await isMemberExist(party_id, user_Id);
      if (isMember) {
        if (!path.includes('/party')) {
          router.replace(`/party/${party_id}`);
        }
        return;
      }
      await skipParticipation(data?.nickname, data?.profile_img, party_id, setMessage, deleteInviteMutation, invite_id);
      if (!path.includes('/party')) {
        console.log('페이지 이동');
        router.replace(`/party/${party_id}`);
      }
      setDisabled(false);
    },
    onSuccess: async () => {
      const user_Id = await getLoginUserIdOnClient();
      queryClient.invalidateQueries({ queryKey: ['partyOwnerInfo', party_id] });
      queryClient.invalidateQueries({ queryKey: ['partyMember', party_id] });
      queryClient.invalidateQueries({ queryKey: ['isMember', party_id, user_Id] });
      queryClient.invalidateQueries({ queryKey: ['myParty', user_Id] });
      queryClient.invalidateQueries({ queryKey: ['invitedParties', user_Id] });
      queryClient.invalidateQueries({ queryKey: ['memberCount', party_id] });
    }
  });

  // 이미지 파일 선택
  const buttonClickHandler = () => {
    if (!imgRef.current) return;
    imgRef.current.click();
  };

  return (
    <div className={display ? 'flex flex-col' : 'hidden'}>
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
              onChange={() => uploadImage(imgRef, setProfile_image)}
            />
          </button>
          <p className="self-stretch text-static-black text-center body-m">파티의 프로필을 설정할 수 있어요</p>
        </div>
        <div className="flex flex-col items-start px-4 self-stretch">
          <input
            value={nickname}
            className="commonInput px-4 text-center"
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요."
          />
        </div>
      </div>
      <div className="flex flex-col p-4 items-start self-stretch body-m-bold">
        <button onClick={() => submitHandlerMutation.mutate()} className="btn-l w-full" disabled={disabled}>
          저장
        </button>
        <button
          className="px-5 py-3 h-12 text-Grey-400 w-full"
          onClick={() => skipHandlerMutation.mutate()}
          disabled={disabled}
        >
          넘어가기
        </button>
      </div>
    </div>
  );
};

export default ParticipationForm;
