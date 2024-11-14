'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFetchUserData, useFetchUserId, useMypageUserData } from '@/store/userStore';
import { useFollowData } from '@/store/useFollowData';
import edit from '../../../public/edit.svg';
import { platformArr } from '@/constants/prefer';
import { FollowModal } from './FollowModal';
import WarmingModal from './WarmingModal';
import { usePathname } from 'next/navigation';

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
    return <div>사용자 정보를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }
  return (
    <section className="bg-[#f5f5f5] py-8  w-full">
      <div className=" gap-4 m-auto w-[1060px] flex flex-row items-center">
        <Image
          src={
            otherUserData?.profile_img ||
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
            <h3 className="body-l-bold">{otherUserData?.nickname}</h3>
            {pathname === '/my-page' ? (
              <Link href={'/my-page/edit'}>
                <Image src={edit} width={20} height={20} alt="프로필 편집" />
              </Link>
            ) : null}
          </div>

          {/* 상세정보 영역 */}
          <div className="flex flex-row gap-8">
<<<<<<< HEAD
            {/* 식빵온도 */}
            <WarmingModal />

            {/* 팔로잉목록 */}
            <FollowModal followerCount={followerCount} followerData={followerData} userId={userId} />

            {/* 플랫폼 */}
=======
            <div className="flex flex-row gap-[8px] items-center w-[268px]">
              <p className="body-xs">식빵온도</p>
              <MyTooltip />
              <WarmingProgress />
              <p className="body-xs-bold text-primary-400">℃</p>
            </div>
            <Dialog>
              <DialogTrigger>
                <p className="flex flex-row items-center gap-2 body-xs">
                  팔로잉 <span className="text-primary-400">{followerCount}</span>
                </p>
              </DialogTrigger>
              <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="w-[340px] pl-5 pr-2">
                <DialogHeader>
                  <DialogTitle>팔로우</DialogTitle>
                </DialogHeader>
                <div>
                  <p className="pb-2 label-s text-Grey-600">팔로우 {followerCount}명</p>
                  <ul className="flex flex-col gap-4 h-[328px] overflow-auto custom-scrollbar">
                    {followerData && followerData.length > 0 ? (
                      followerData.map((follower: FollowingUser) => (
                        <li key={follower.user_id} className="flex flex-row justify-between pr-1">
                          <div className="flex flex-row items-center gap-2">
                            <Image
                              src={
                                follower.profile_img ||
                                'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/avatar.png'
                              }
                              alt={`${follower.nickname} 님의 프로필 사진`}
                              width={50}
                              height={50}
                              style={{
                                objectFit: 'cover',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%'
                              }}
                            />
                            <span className="body-s">{follower.nickname}</span>
                          </div>
                          <button
                            onClick={() => unfollowMutation.mutate(follower.user_id)}
                            className="outline-disabled-btn-s"
                          >
                            팔로우 취소
                          </button>
                        </li>
                      ))
                    ) : (
                      <li>아직 팔로우한 사람이 없습니다.</li>
                    )}
                  </ul>
                </div>
                <DialogDescription></DialogDescription>
              </DialogContent>
            </Dialog>
>>>>>>> d0f169c2d1c7b0ac34f5d6166486c2a7576d1c80
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
            <div className="flex flex-row items-center gap-2  body-xs">
              <span>장르</span>
              <ul className="flex flex-row items-center gap-2">
                {Array.isArray(otherUserData?.platform) &&
                  otherUserData?.genre.map((genre, index) => (
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
