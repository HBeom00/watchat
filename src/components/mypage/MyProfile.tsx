'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchUserIdByNickname, useFetchUserData, useMypageUserData } from '@/store/userStore';
import { useFollowData } from '@/store/useFollowData';
import edit from '../../../public/edit.svg';
import { platformArr } from '@/constants/prefer';
import { FollowModal } from './FollowModal';
import WarmingModal from './WarmingModal';
import { usePathname, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

const MyProfile = () => {
  const pathname = usePathname();
  const params = useSearchParams();
  const userParams = params.get('user'); // user의 값 가져옴

  // 마이페이지인경우의 데이터 가져오기
  const { data: userData } = useFetchUserData();

  // userId가져오기
  const { data: fetchedUserId, isFetching: isUserIdFetching } = useQuery<string>({
    queryKey: ['userId', userParams],
    queryFn: () => {
      if (userParams) {
        return fetchUserIdByNickname(userParams);
      }
      return '';
    },
    enabled: !!userParams
  });

  const userId = pathname === '/my-page' ? userData?.user_id : fetchedUserId;

  const { otheruserData: myPageUserData, userError } = useMypageUserData();

  console.log('?????????', myPageUserData?.data?.user_id);

  // 팔로잉 데이터 가져오기
  const { data: followerDataResult, isPending: pending, isError: error } = useFollowData(userId);

  const { followerCount, followerData } = followerDataResult || { followerCount: 0, followerData: [] };

  if (pending || isUserIdFetching) {
    return <div>사용자 정보를 불러오는 중입니다...</div>;
  }

  if (error || userError) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }
  return (
    <section className="bg-[#f5f5f5] py-8  w-full">
      <div className=" gap-4 m-auto w-[1060px] flex flex-row items-center">
        <Image
          src={
            myPageUserData?.profile_img ||
            'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/avatar.png'
          }
          alt="프로필 이미지"
          width={100}
          height={100}
          style={{
            objectFit: 'cover',
            width: '100px',
            height: '100px',
            borderRadius: '50%'
          }}
        />
        <article>
          {/* 닉네임영역 */}
          <div className="flex gap-2">
            <h3 className="body-l-bold">{myPageUserData?.nickname}</h3>
            <Link href={'/my-page/edit'}>
              <Image src={edit} width={20} height={20} alt="프로필 편집" />
            </Link>
          </div>

          {/* 상세정보 영역 */}
          <div className="flex flex-row gap-8">
            {/* 식빵온도 */}
            <WarmingModal userId={userId} />

            {/* 팔로잉목록 */}
            <FollowModal followerCount={followerCount} followerData={followerData} userId={userId} />

            {/* 플랫폼 */}
            <div className="flex flex-row items-center gap-2  body-xs">
              <span>플랫폼</span>
              <ul className="flex flex-row items-center gap-2">
                {Array.isArray(myPageUserData?.platform) &&
                  myPageUserData?.platform.map((platformName: string, index: string) => {
                    // platformArr에서 플랫폼 이미지 찾아 넣기
                    const platformImg = platformArr.find((item) => item.name === platformName);

                    return (
                      <li key={index} className="flex items-center">
                        {platformImg ? (
                          <Image
                            src={platformImg.logoUrl}
                            alt={platformImg.name}
                            width={24}
                            height={24}
                            className="w-6 h-6"
                          />
                        ) : null}
                      </li>
                    );
                  })}
              </ul>
            </div>

            {/* 장르 */}
            <div className="flex flex-row items-center gap-2  body-xs">
              <span>장르</span>
              <ul className="flex flex-row items-center gap-2">
                {Array.isArray(myPageUserData?.platform) &&
                  myPageUserData?.genre.map((genre: string, index: string) => (
                    <li
                      key={index}
                      className="rounded-[8px] py-[6px] px-[12px]  border border-grey-300 text-gray-400 body-xs"
                    >
                      {genre}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default MyProfile;
