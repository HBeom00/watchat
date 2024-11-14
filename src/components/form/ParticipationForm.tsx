'use client';

import { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { isMemberExist } from '@/utils/memberCheck';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDeleteInviteMutation } from '@/utils/myPage/usdDeleteInvite';
import uploadImage from '@/utils/fileUploader/uploadImage';
import submitParticipation from '@/utils/participation/submitParticipation';
import { useFetchUserData } from '@/store/userStore';
import skipParticipation from '@/utils/participation/skipParticipation';
import { defaultImage } from '@/constants/image';

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
  const [profile_image, setProfile_image] = useState(defaultImage);
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
              <Image src={'/photo_camera.svg'} width={16} height={16} alt="파일 변경" />
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
        <div className="flex flex-col items-start px-4 self-stretch text-static-black">
          <input
            value={nickname}
            className="commonInput px-4 text-center"
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요."
          />
        </div>
      </div>
      <div className="flex flex-col p-4 items-start self-stretch body-m-bold">
        <button
          onClick={() => {
            if (nickname.length > 7) {
              alert('닉네임은 7자 이하로 입력해주세요');
              return;
            }
            submitHandlerMutation.mutate();
          }}
          className="btn-l w-full"
          disabled={disabled}
        >
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
