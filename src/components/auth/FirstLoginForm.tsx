'use client';

import { useFetchUserData } from '@/store/userStore';
import browserClient from '@/utils/supabase/client';
import { onClickGenre, onClickPlatform, useImageUpload } from '@/utils/userProfile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import photoCameraIcon from '../../../public/photo_camera.svg';
import { genreArr, platformArr } from '@/constants/prefer';

const checkNickname = async (nickname: string, currentUserNickname: string) => {
  // 만약 닉네임이 현재 사용자의 닉네임과 같으면 중복 체크를 하지 않게
  if (nickname === currentUserNickname) {
    return false; // 중복 체크 없이 유효한 값으로 처리
  }

  // 닉네임이 이미 사용 중인지 확인
  const { data, error } = await browserClient.from('user').select('nickname').eq('nickname', nickname).maybeSingle(); // maybeSingle로 수정하여 결과가 없을 경우 null을 반환

  if (error) {
    console.error('닉네임 중복 확인 오류:', error);
    return true; // 오류 발생 시 중복으로 처리
  }

  return data !== null; // 이미 사용 중인 닉네임이면 true, 아니면 false
};

const FirstLoginForm = () => {
  const { imgFile, imgRef, uploadImage } = useImageUpload();
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [nickname, setNickname] = useState<string>('');
  const route = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { data: userData, isPending, isError } = useFetchUserData();

  // useEffect를 사용하여 userData가 로드된 후 장르랑 플랫폼을 설정
  useEffect(() => {
    if (userData?.genre) {
      setGenres(userData.genre);
      setPlatforms(userData.platform);
    }
  }, [userData]);

  const nicknameSchema = z.object({
    nickname: z
      .string()
      .min(2, { message: '2글자 이상 입력해주세요' })
      .max(7, { message: '7글자 이하로 입력해주세요' })
      .refine(
        async (nickname) => {
          const isDuplicate = await checkNickname(nickname, userData?.nickname || ''); // Supabase를 통해 중복 체크
          return !isDuplicate; // 중복이 아니면 유효한 값
        },
        {
          message: '이미 사용 중인 닉네임입니다.'
        }
      )
  });

  const { register, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      nickname: userData?.nickname || ''
    },
    resolver: zodResolver(nicknameSchema)
  });
  // 서버에 사용자 정보를 저장하는 mutation 함수
  const mutation = useMutation<void, Error, MutatedUser>({
    mutationFn: async (userData: FieldValues) => {
      const file = imgRef.current?.files?.[0];
      const {
        data: { user }
      } = await browserClient.auth.getUser();

      if (!user) {
        throw new Error('사용자 ID를 가져오는 데 실패했습니다.');
      }

      const profile_image_name = `${user?.id}/${new Date().getTime()}`;
      const defaultProfileImgUrl =
        'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/default_profile.png';

      // 파일이 있는 경우에만 업로드
      if (file) {
        await browserClient.storage.from('profile_image').upload(profile_image_name, file, {
          cacheControl: 'no-store',
          upsert: true
        });
      }
      const profileImgUrl = file
        ? browserClient.storage.from('profile_image').getPublicUrl(profile_image_name).data.publicUrl
        : userData?.profile_img || defaultProfileImgUrl;

      // 회원가입 또는 수정 로직
      if (pathname === '/my-page/edit' && !!user) {
        await deleteOldImages(user.id, profile_image_name); // 기존 이미지 삭제
        await browserClient
          .from('user')
          .update({
            nickname: userData.nickname,
            profile_img: profileImgUrl,
            platform: platforms,
            genre: genres
          })
          .eq('user_id', user.id);

        route.push('/my-page');
      } else if (!!user) {
        await browserClient.from('user').insert({
          user_id: user.id,
          user_email: user.email,
          nickname,
          profile_img: profileImgUrl,
          platform: platforms,
          genre: genres
        });

        route.push('/');
      }
    },
    onSuccess: () => {
      alert(pathname === '/my-page/edit' ? '수정이 완료되었습니다.' : '회원가입이 완료되었습니다');
      route.push(pathname === '/my-page/edit' ? '/my-page' : '/');
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    }
  });

  type User = {
    id: string;
    email?: string;
  };

  type MutatedUser = {
    user: User | null;
    file: File | null;
    profile_image_name: string;
    nickname: string;
    pathname: string;
    platforms: string[];
    genres: string[];
    deleteOldImages: (userId: string, currentImageName: string) => Promise<void>;
  };

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

  //const defaultProfileImgUrl ='https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/default_profile.png';

  // 이미지를 변경하지 않고 수정 시 이전 이미지 사용
  //const profileImageUrl = userData?.profile_img || defaultProfileImgUrl;

  // 완료 버튼 클릭 시
  const onSuccessHandler: SubmitHandler<{ nickname: string }> = async ({ nickname }) => {
    const { data: authData } = await browserClient.auth.getUser();
    const user = authData?.user;

    if (!user) {
      console.error('사용자 정보를 가져오지 못했습니다.');
      return;
    }

    mutation.mutate({
      user,
      file: imgRef.current?.files?.[0] || null,
      profile_image_name: `${user.id}/${new Date().getTime()}`,
      nickname: nickname,
      pathname,
      platforms,
      genres,
      deleteOldImages
    });
  };

  // 취소버튼 핸들러
  const editCancelHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const confirmed = confirm('정말 취소하시겠습니까?');
    if (confirmed) {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
      route.back();
    }

    if (isPending) {
      return <div>사용자 정보를 불러오는 중 입니다...</div>;
    }
    if (isError) {
      return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
    }
  };

  // 이미지파일 유효성 검사
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

      if (!validImageTypes.includes(file.type)) {
        alert('허용되지 않는 파일 확장자입니다! PNG, JPEG, JPG, GIF 파일만 업로드 가능합니다.');

        // 파일 선택 초기화
        e.target.value = ''; // 파일 초기화하여 다시 선택할 수 있도록 함
        return;
      }

      // 파일 타입이 유효한 경우 업로드 처리
      uploadImage(); // 파일을 전달하지 않고, 내부에서 파일을 처리하도록 변경
    }
  };

  // 장르선택 핸들러
  const genreClickHandler = (genre: string) => {
    // 장르를 6개 이상 선택하려하면 alert (genres안에 선택하려는 장르가 포함되지 않은 경우)
    if (genres.length >= 5 && !genres.includes(genre)) {
      alert('최대 5개까지 선택할 수 있습니다!');
      return;
    }

    // 장르 수가 5개 이하거나 이미 선택된 장르를 다시 누를 때 실행
    onClickGenre({ genre, setGenres });
  };

  return (
    <form
      onSubmit={handleSubmit(onSuccessHandler)}
      className="flex flex-col max-w-[340px] m-auto mt-[100px] mb-[152px] mobile:mx-[20px] mobile:max-w-[355px]"
    >
      <div className="w-[100px] h-[100px] relative m-auto mb-[32px]">
        <Image
          src={
            imgFile ||
            userData?.profile_img ||
            'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/default_profile.png'
          }
          alt="프로필 이미지"
          width={100}
          height={100}
          className="rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            objectFit: 'cover',
            width: '100px',
            height: '100px',
            borderRadius: '50%'
          }}
        />
        <label
          htmlFor="selectImg"
          className="absolute bottom-0 right-0 w-[24px] h-[24px] bg-[#c2c2c2] flex items-center justify-center rounded-[18px] cursor-pointer"
        >
          <Image src={photoCameraIcon} width={16} height={16} alt="프로필 이미지 선택" style={{ width: '16px' }} />
        </label>
        <input
          id="selectImg"
          type="file"
          ref={imgRef}
          accept="image/png, image/jpeg, image/jpg, image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="text-start inputDiv mb-[32px]">
        <p className=" body-m-bold">
          닉네임<span className="text-primary-400">*</span>
        </p>
        <input
          type="text"
          {...register('nickname')}
          placeholder="닉네임을 입력하세요"
          onChange={(e) => setNickname(e.target.value)}
          className="border-[2px] commonEmailInput border-Grey-50"
        />
        {formState.errors.nickname && <span className="text-red-600">{formState.errors.nickname.message}</span>}
      </div>

      <div className="mb-[32px]">
        <h3 className=" body-m-bold mb-[8px]">플랫폼</h3>
        <h5 className="body-xs  mb-[8px] text-Grey-600">플랫폼과 장르를 선택해주시면 파티를 추천해드려요.</h5>
        <ul className="flex flex-wrap gap-[8px]">
          {platformArr.map((platform, index) => {
            return (
              <li
                key={index}
                onClick={() => onClickPlatform({ platform: platform.name, setPlatforms })}
                className={
                  platforms.includes(platform.name)
                    ? 'px-[12px] py-[6px] h-[32px] bg-primary-50 rounded-lg text-primary-400 font-semibold body-xs border cursor-pointer border-primary-400'
                    : 'px-[12px] py-[6px] h-[32px] bg-white rounded-lg text-Grey-300 font-semibold body-xs border cursor-pointer'
                }
              >
                <div className="flex items-center space-x-2">
                  <Image src={platform.logoUrl} alt={`${platform.name} 로고`} width={16} height={16} />
                  <span>{platform.name}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mb-[64px]">
        <h3 className=" body-m-bold">장르</h3>
        <h5 className="body-xs  mb-[8px] text-Grey-600">최대 5개까지 선택이 가능합니다.</h5>
        <ul className="flex flex-wrap gap-[8px]">
          {genreArr.map((genre, index) => {
            return (
              <li
                key={index}
                onClick={() => genreClickHandler(genre)}
                className={
                  genres.includes(genre)
                    ? 'px-[12px] py-[6px] h-[32px] bg-primary-50 rounded-lg text-primary-400 font-semibold body-xs border cursor-pointer border-primary-400'
                    : 'px-[12px] py-[6px] h-[32px] bg-white rounded-lg text-Grey-300 font-semibold body-xs border cursor-pointer'
                }
              >
                {genre}
              </li>
            );
          })}
        </ul>
      </div>
      {pathname === '/my-page/edit' ? (
        <div className="flex flex-row gap-[20px]">
          <button
            onClick={editCancelHandler}
            className="px-[24px] py-[16px] bg-white rounded-lg text-Grey-300 font-semibold text-[15px] border cursor-pointer w-[157px]"
          >
            취소
          </button>
          <button className="btn-xl bg-white w-[157px]">수정하기</button>
        </div>
      ) : (
        <button className="btn-xl bg-white w-full">완료</button>
      )}
    </form>
  );
};

export default FirstLoginForm;
