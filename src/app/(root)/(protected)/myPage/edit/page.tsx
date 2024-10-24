'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import browserClient from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { getUserId } from '@/utils/getUserId';
import Image from 'next/image';
import { PostgrestError } from '@supabase/supabase-js';

const EditProfilePage = () => {
  const router = useRouter();
  const [imgFile, setImgFile] = useState('');
  const [nickname, setNickname] = useState('');
  const imgRef = useRef<HTMLInputElement>(null);

  type UserData = {
    nickname: string;
    profile_img: string;
  } | null;

  // 로그인한 사용자 정보를 불러옴 (기존 정보를 띄워주기 위해)
  const fetchUserData = async () => {
    const userId = await getUserId();
    const { data: userData, error }: { data: UserData; error: PostgrestError | null } = await browserClient
      .from('user')
      .select('profile_img, nickname')
      .eq('user_id', userId)
      .single();

    console.log('에러', error);
    if (userData) {
      setImgFile(userData.profile_img);
      setNickname(userData.nickname);
    }
    if (error) {
      console.error('사용자 정보를 불러오는데 실패했습니다. => ', error);
    }
  };

  // 페이지가 렌더링될 때 fetchUserData를 실행
  useEffect(() => {
    fetchUserData();
  });

  // zod
  const editProfile = z.object({
    nickname: z.string().min(2, '닉네임은 필수입니다.')
  });

  // 리액트 훅 폼 (유효성 검사)
  const { register, handleSubmit, formState, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      nickname: nickname
    },
    resolver: zodResolver(editProfile)
  });

  //이미지 업로드 onChange
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

  //폼 제출 함수
  const onSubmit = async () => {
    const userId = await getUserId();
    const { data: userData, error: updateError } = await browserClient
      .from('user')
      .update({
        nickname: watch('nickname'),
        profile_img: imgFile
      })
      .eq('user_id', userId);

    if (updateError) {
      console.log('프로필 수정에 실패했습니다 => ', updateError);
    } else {
      console.log('프로필 수정에 성공했습니다 => ', userData);
    }

    router.push('/mypage');
  };

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
          {formState.errors.nickname && <span>{formState.errors.nickname.message}</span>}
        </div>
        <div>
          <label>장르</label>
        </div>
        <div>
          <label>플랫폼</label>
        </div>
        <button type="submit">수정하기</button>
      </form>
    </section>
  );
};

export default EditProfilePage;
