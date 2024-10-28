'use client';

import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { useFetchUserData } from '@/store/userStore';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const EditProfilePage = () => {
  const imgRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: userData, isPending, isError } = useFetchUserData();
  //const { userData, fetchUserData } = useUserStore();
  const [imgFile, setImgFile] = useState(userData?.profile_img);

  // zod
  const editProfile = z.object({
    nickname: z.string().min(2, '닉네임은 필수입니다.').max(6, '6글자까지 입력 가능합니다.')
  });

  // 리액트 훅 폼 (유효성 검사)
  const { register, handleSubmit, formState, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      nickname: userData?.nickname
    },
    resolver: zodResolver(editProfile)
  });

  // 이미지 업로드 onChangesw
  const uploadImage = () => {
    const file = imgRef.current?.files?.[0]; // 선택한 파일을 file에 저장
    if (file) {
      // 파일이 있다면
      const reader = new FileReader(); // 1. 사용할 FileReader를 reader에 선언
      reader.readAsDataURL(file); // 2. .readAsDataURL메서드를 사용해 파일을 데이터 URL형식으로 변환
      reader.onloadend = () => {
        // 3. FileReader가 파일을 다 읽고 난 뒤 실행되는 함수
        if (typeof reader.result === 'string') {
          setImgFile(reader.result); // 4. reader.result는 3에서 읽은 데이터를 담고있음. 이걸 ImgFile에 담아줌
        }
      };
    }
  };
  // supabase storage에 이미지 저장
  const uploadStorage = async (file: File) => {
    const userId = await getLoginUserIdOnClient();
    if (!userId) {
      console.error('사용자 ID를 가져오는 데 실패했습니다.');
      return ''; // userId가 유효하지 않으면 빈 문자열 반환
    }

    const profile_image_name = `${userId}/${new Date().getTime()}`;

    const { data, error } = await browserClient.storage.from('profile_image').upload(profile_image_name, file, {
      cacheControl: 'no-store',
      upsert: true
    });

    if (data) {
      console.log('supabase에 이미지를 업로드 하는데 성공했습니다.');
      const newImageUrl = browserClient.storage.from('profile_image').getPublicUrl(profile_image_name).data.publicUrl;

      await deleteOldImages(userId, profile_image_name);

      return newImageUrl;
    }

    if (error) {
      console.error('supabase에 이미지를 업로드 하는데 실패했습니다.', error.message);
      return '';
    }
  };

  // 업로드한 이미지 제외 (사용하지 않는 이미지) 모두 삭제
  const deleteOldImages = async (userId: string, currentImageName: string) => {
    console.log('현재 이미지 =>', currentImageName);

    const { data: imgList, error: listError } = await browserClient.storage.from('profile_image').list(userId);

    if (listError) {
      console.error('이미지 목록 가져오기에 실패했습니다 => ', listError);
      return;
    }

    if (imgList && imgList.length > 0) {
      // 현재 이미지 이름과 다른 이미지를 필터링
      const deleteImg = imgList
        .filter((file) => file.name !== currentImageName.split('/').pop()) // 현재 이미지 이름에서 파일 이름만 비교
        .map((file) => `${userId}/${file.name}`);

      console.log('삭제할 이미지 목록 => ', deleteImg); // 삭제할 이미지 목록들

      if (deleteImg.length > 0) {
        const { data: deleteData, error: deleteError } = await browserClient.storage
          .from('profile_image')
          .remove(deleteImg);

        if (deleteError) {
          console.error('이미지 삭제 중 오류 발생 => ', deleteError);
        } else {
          console.log('정상적으로 삭제되었습니다.', deleteData);
        }
      }
    }
  };

  // 변경된 프로필로 업데이트해주는 함수
  const updateUserData = async () => {
    const userId = await getLoginUserIdOnClient();
    let profile_img = imgFile; // imgFile( uploadImage에서 저장한 이미지정보 )을 profile_img에 선언

    const selectImg = imgRef.current?.files?.[0]; // 선택된 이미지 selectImg에 선언
    if (selectImg) {
      const newProfileImgURL = await uploadStorage(selectImg); // 선택된 이미지가있다면 선택된 이미지를 스토리지에 올리고 newProfileImgURL에 선언

      if (newProfileImgURL) {
        profile_img = newProfileImgURL;
      }
    }
    // supabase에 수정된 정보 넣어줌 = mutation
    const { data: updatedUserData, error: updateError } = await browserClient
      .from('user')
      .update({
        nickname: watch('nickname'), // 닉네임은 react-hook-form을 이용해 input에 변경이 있는 경우 수정해줌
        profile_img: profile_img
      })
      .eq('user_id', userId);

    if (updateError) {
      console.log('프로필 수정에 실패했습니다 => ', updateError);
    } else {
      console.log('프로필 수정에 성공했습니다 => ', updatedUserData);
      return updateUserData;
    }
  };

  const mutation = useMutation({
    mutationFn: updateUserData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    }
  });

  //폼 제출 함수
  const onSubmit = async () => {
    mutation.mutate();
  };

  if (isPending) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (isError) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <section>
      <h1>프로필 수정</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Image
          src={imgFile || 'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/avatar.png'}
          alt="프로필 이미지"
          width={150}
          height={150}
        />
        <input id="selectImg" type="file" ref={imgRef} accept="image/*" onChange={uploadImage} />
        <div>
          <label htmlFor="nickname">닉네임</label>
          <input {...register('nickname')} id="nickname" type="text" required />
          {formState.errors.nickname?.message && <span>{String(formState.errors.nickname.message)}</span>}
        </div>
        <div>
          <label>장르</label>
        </div>
        <div>
          <label>플랫폼</label>
        </div>
        <button type="submit">수정하기</button> <Link href={'/mypage'}>마이페이지로 돌아가기</Link>
      </form>
    </section>
  );
};

export default EditProfilePage;
