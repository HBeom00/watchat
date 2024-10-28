'use client';

import { genreArr, platformArr } from '@/utils/prefer';
import browserClient from '@/utils/supabase/client';
import { onClickGenre, onClickPlatform } from '@/utils/userProfile';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';

const nicknameSchema = z.object({
  nickname: z.string().min(2, { message: '2글자 이상 입력해주세요' })
});

const FirstLoginForm = () => {
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [imgFile, setImgFile] = useState<string>('');
  const imgRef = useRef<HTMLInputElement>(null);
  const route = useRouter();

  const { register, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      nickname: ''
    },
    resolver: zodResolver(nicknameSchema)
  });

  // const onClickPlatform = (platform: string) => {
  //   setPlatforms((prev) => (prev.includes(platform) ? prev.filter((el) => el !== platform) : [...prev, platform]));
  // };

  // const onClickGenre = (genre: string) => {
  //   setGenres((prev) => (prev.includes(genre) ? prev.filter((el) => el !== genre) : [...prev, genre]));
  // };

  // 이미지 업로드 onChange
  const uploadImage = () => {
    const file = imgRef.current?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImgFile(reader.result);
        }
      };
    }
  };

  // 완료 버튼 클릭 시
  const onSuccessHandler = async ({ nickname }: FieldValues) => {
    const file = imgRef.current?.files?.[0];
    const {
      data: { user }
    } = await browserClient.auth.getUser();

    if (!user) {
      console.error('사용자 ID를 가져오는 데 실패했습니다.');
      return '';
    }

    const profile_image_name = `${user?.id}/${new Date().getTime()}`;

    if (file)
      await browserClient.storage.from('profile_image').upload(profile_image_name, file, {
        cacheControl: 'no-store',
        upsert: true
      });

    if (!!user) {
      await browserClient
        .from('user')
        .insert({
          user_id: user?.id,
          user_email: user?.email,
          nickname: nickname,
          profile_img: browserClient.storage.from('profile_image').getPublicUrl(profile_image_name).data.publicUrl,
          platform: platforms,
          genre: genres
        })
        .eq('user_id', user?.id);
    }
    alert('등록되었습니다.');
    route.push('/');
  };

  return (
    <form onSubmit={handleSubmit(onSuccessHandler)} className="flex flex-col gap-5">
      <div>
        <Image
          src={imgFile || 'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/avatar.png'}
          alt="프로필 이미지"
          width={100}
          height={100}
        />
        <input id="selectImg" type="file" ref={imgRef} accept="image/*" onChange={uploadImage} />
      </div>

      <div>
        <p className="font-bold text-[20px]">
          닉네임<span>*</span>
        </p>
        <input type="text" {...register('nickname')} placeholder="닉네임을 입력하세요" className="border-2" />
        {formState.errors.nickname && <span className="text-red-600">{formState.errors.nickname.message}</span>}
      </div>

      <div>
        <p className="font-bold text-[20px]">플랫폼</p>
        <ul>
          {platformArr.map((platform, index) => {
            return (
              <li
                key={index}
                onClick={() => onClickPlatform({ platform, setPlatforms })}
                className={
                  platforms.includes(platform) ? 'text-purple-500 cursor-pointer' : 'text-black cursor-pointer'
                }
              >
                {platform}
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <p className="font-bold text-[20px]">장르</p>
        <ul>
          {genreArr.map((genre, index) => {
            return (
              <li
                key={index}
                onClick={() => onClickGenre({ genre, setGenres })}
                className={genres.includes(genre) ? 'text-purple-500 cursor-pointer' : 'text-black cursor-pointer'}
              >
                {genre}
              </li>
            );
          })}
        </ul>
      </div>

      <button>완료</button>
    </form>
  );
};

export default FirstLoginForm;
