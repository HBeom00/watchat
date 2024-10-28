'use client';

import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { isMemberExist, partySituationChecker } from '@/utils/memberCheck';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

const ParticipationForm = ({ party_id }: { party_id: string }) => {
  // 스토리지 업로드 이미지 파일
  const imgRef = useRef<HTMLInputElement>(null);

  // 보여주기 이미지
  const [profile_image, setProfile_image] = useState(
    'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/avatar.png'
  );
  const [nickname, setNickname] = useState('익명');
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

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

    // 파티 상태 확인하기
    const endCheck = await partySituationChecker(party_id);
    if (endCheck === '알수없음') {
      alert('존재하지 않는 파티입니다');
      return;
    } else if (endCheck === '모집마감') {
      alert('모집이 마감된 파티입니다');
      return;
    } else if (endCheck === '종료') {
      alert('종료된 파티입니다');
      return;
    }

    const isMember = await isMemberExist(party_id, user_Id);
    if (isMember) {
      alert('이미 참가한 파티입니다');
      router.replace(`/party/${party_id}`);

      return;
    }

    // 참가하기
    const { error: participationError } = await browserClient
      .from('team_user_profile')
      .insert({ nickname, profile_image, party_id });

    if (participationError) {
      alert('파티에 참가할 수 없습니다');
    } else {
      let profile_img = profile_image; // imgFile( uploadImage에서 저장한 이미지정보 )을 profile_img에 선언

      const selectImg = imgRef.current?.files?.[0]; // 선택된 이미지 selectImg에 선언
      if (selectImg) {
        const newProfileImgURL = await uploadStorage(selectImg, party_id, user_Id); // 선택된 이미지가있다면 선택된 이미지를 스토리지에 올리고 newProfileImgURL에 선언

        if (newProfileImgURL) {
          profile_img = newProfileImgURL;
        } else if (newProfileImgURL === '') {
          alert('이미지업로드에 실패했습니다');
        }
      }
      // 멤버 프로필이미지 업데이트
      const { error } = await browserClient
        .from('team_user_profile')
        .update({ profile_image: profile_img })
        .eq('user_id', user_Id)
        .eq('party_id', party_id);
      if (error) {
        console.log(error.message);
      }
      alert('파티에 참가하신 걸 환영합니다!');
      router.replace(`/party/${party_id}`);
    }
  };
  return (
    <>
      <div className="flex flex-col gap-10 p-10 bg-red-300">
        <Image src={profile_image} alt="프로필 이미지" width={150} height={150} />
        <input id="party_profile" type="file" ref={imgRef} accept="image/*" onChange={uploadImage} />
        <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임을 입력하세요" />
      </div>
      <button onClick={submitHandler} className="bg-blue-300 rounded-2xl" disabled={disabled}>
        참가하기!!
      </button>
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
    console.error('멤버 ID를 가져오는 데 실패했습니다.');
    return ''; // memberId가 유효하지 않으면 빈 문자열 반환
  }

  const profile_image_name = `${memberIdResponse.data[0].profile_id}/${new Date().getTime()}`;

  const { data, error } = await browserClient.storage.from('team_user_profile_image').upload(profile_image_name, file, {
    cacheControl: 'no-store',
    upsert: true
  });

  if (data) {
    console.log('supabase에 이미지를 업로드 하는데 성공했습니다.');
    const newImageUrl = browserClient.storage.from('team_user_profile_image').getPublicUrl(profile_image_name)
      .data.publicUrl;

    return newImageUrl;
  }

  if (error) {
    console.error('supabase에 이미지를 업로드 하는데 실패했습니다.', error.message);
    return '';
  }
};
