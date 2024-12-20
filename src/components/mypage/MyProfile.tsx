'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFetchUserData, useFetchUserId, useMypageUserData } from '@/store/userStore';
import { useFollowData } from '@/utils/myPage/useFollowData';
import edit from '../../../public/edit.svg';
import { platformArr } from '@/constants/prefer';
import { FollowModal } from './FollowModal';
import WarmingModal from './WarmingModal';
import { usePathname } from 'next/navigation';
import { MyTooltip } from './Tooltip';
import ComponentLoading from './ComponentLoading';

const MyProfile = () => {
  const pathname = usePathname();
  //const params = useSearchParams();
  //const userParams = params.get('user'); // user의 값 가져옴

  // 마이페이지인경우의 데이터 가져오기 (팔로잉목록 가져오기위해)
  const { data: userData } = useFetchUserData();

  const fetchedUserId = useFetchUserId();

  const { otherUserData } = useMypageUserData();

  const userId = pathname === '/my-page' ? userData?.user_id || '' : fetchedUserId || '';

  // 팔로잉 데이터 가져오기
  const { data: followerDataResult, isPending: pending, isError: error } = useFollowData(userId);

  const { followerCount, followerData } = followerDataResult || { followerCount: 0, followerData: [] };

  if (pending) {
    return (
      <div className="bg-[#f5f5f5]  w-full  mx-auto box-border flex flex-col justify-center items-center h-[164px]mobile:overflow-hidden mobile:h-[306px]">
        <li className=" flex flex-col justify-center items-center m-auto gap-2">
          <ComponentLoading />
          <p className="body-m text-Grey-600 ">데이터를 불러오는 중 입니다.</p>
        </li>
      </div>
    );
  }

  if (error) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }
  return (
    <section className="bg-[#f5f5f5] py-8 w-full  mx-auto box-border mobile:overflow-hidden">
      <div
        className={`
          gap-4 m-auto w-[1060px] flex flex-row items-center flex-warp
          mobile:flex-col mobile:justify-start mobile:mx-[20px] mobile:w-full mobile:items-start
          `}
      >
        <div className="flex items-center mobile:gap-[16px]">
          <div className="relative w-[100px] h-[100px] mobile:w-[80px] mobile:h-[80px] rounded-full overflow-hidden">
            <Image
              src={
                otherUserData?.profile_img ||
                'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/avatar.png'
              }
              alt="프로필 이미지"
              fill
              className="object-cover"
            />
          </div>

          {/* 모바일 닉네임영역 */}
          <div className="flex-row gap-2 hidden mobile:flex ">
            <h3 className="body-l-bold">{otherUserData?.nickname}</h3>
            {pathname === '/my-page' ? (
              <Link href={'/my-page/edit'}>
                <Image src={edit} width={20} height={20} alt="프로필 편집" />
              </Link>
            ) : null}
          </div>
        </div>
        <article>
          {/* 닉네임영역 */}
          <div className="flex gap-2 mobile:hidden">
            <h3 className="body-l-bold">{otherUserData?.nickname}</h3>
            {pathname === '/my-page' ? (
              <Link href={'/my-page/edit'}>
                <Image src={edit} width={20} height={20} alt="프로필 편집" />
              </Link>
            ) : null}
          </div>

          {/* 상세정보 영역 */}
          <div
            className={`
            flex flex-row gap-8
            mobile:flex-col mobile:gap-[16px]
            `}
          >
            {/* 식빵온도 */}
            <div className="flex flex-row gap-[8px] items-center">
              <p className="body-xs">식빵온도</p>
              <MyTooltip />
              <WarmingModal />
            </div>

            {/* 팔로잉목록 */}
            <p className="flex flex-row items-center gap-2 body-xs">
              팔로잉
              <FollowModal followerCount={followerCount} followerData={followerData} userId={userId} />
            </p>
            {/* 플랫폼 */}
            <div className="flex flex-row items-center gap-2  body-xs">
              <span>플랫폼</span>
              <ul className="flex flex-row items-center gap-2">
                {Array.isArray(otherUserData?.platform) &&
                  otherUserData?.platform.map((platformName, index) => {
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
            <div
              className={`flex flex-row items-center gap-2  body-xs
              mobile:items-start`}
            >
              <span className="mobile:whitespace-nowrap mobile:mt-[6px]">장르</span>
              <ul
                className={`
                flex flex-row items-center gap-2
                mobile:flex-wrap
                `}
              >
                {Array.isArray(otherUserData?.platform) &&
                  otherUserData?.genre.map((genre, index) => (
                    <li
                      key={index}
                      className="rounded-[8px] py-[6px] px-[12px]  border border-grey-300 text-Grey-400 body-xs"
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
