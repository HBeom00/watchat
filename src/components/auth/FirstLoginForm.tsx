import { genreArr, platformArr } from '@/utils/prefer';
import browserClient from '@/utils/supabase/client';
import { onClickGenre, onClickPlatform, useImageUpload } from '@/utils/userProfile';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';

const nicknameSchema = z.object({
  nickname: z.string().min(2, { message: '2글자 이상 입력해주세요' })
});

const FirstLoginForm = () => {
  const { imgFile, imgRef, uploadImage } = useImageUpload();
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const route = useRouter();
  const pathname = usePathname();

  const { register, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      nickname: ''
    },
    resolver: zodResolver(nicknameSchema)
  });

  uploadImage();

  // 이전 이미지 삭제 로직
  const deleteOldImages = async (userId: string, currentImageName: string) => {
    const { data: imgList, error: listError } = await browserClient.storage.from('profile_image').list(userId);

    if (listError) {
      console.error('이미지 목록 가져오기에 실패했습니다 => ', listError);
      return;
    }

    if (imgList && imgList.length > 0) {
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
    console.log('현재 이미지 =>', currentImageName);
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

    const profileImgUrl = browserClient.storage.from('profile_image').getPublicUrl(profile_image_name).data.publicUrl;

    // 회원가입페이지일 경우와 마이페이지일 경우 분리
    if (file && pathname === '/mypage/edit' && !!user) {
      // 마이페이지인 경우
      await deleteOldImages(user.id, profile_image_name); // 기존 이미지 삭제
      await browserClient
        .from('user')
        .update({
          nickname,
          profile_img: profileImgUrl,
          platform: platforms,
          genre: genres
        })
        .eq('user_id', user.id);

      alert('수정이 완료되었습니다.');
      route.push('/mypage');
    } else if (!!user) {
      // 회원가입인 경우
      await browserClient
        .from('user')
        .insert({
          user_id: user?.id,
          user_email: user?.email,
          nickname: nickname,
          profile_img: profileImgUrl,
          platform: platforms,
          genre: genres
        })
        .eq('user_id', user?.id);

      alert('등록되었습니다.');
      route.push('/');
    }
  };

  const editCancelHandler = () => {
    route.push('/mypage');
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
      {pathname === '/mypage/edit' ? (
        <div>
          <button>수정하기</button>
          <button onClick={editCancelHandler}>취소하기</button>
        </div>
      ) : (
        <button>완료</button>
      )}
    </form>
  );
};

export default FirstLoginForm;
