'use client';
import PlatformImageDetail from '@/components/styleComponents/PlatformImageDetail';
import { fetchMoviesDetail, fetchTvDetail } from '@/serverActions/TMDB';
import { platform } from '@/types/partyInfo';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

const DetailInfo = ({
  videoNumber,
  videoType,
  videoPlatform
}: {
  videoNumber: number;
  videoType: string;
  videoPlatform: string;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ['videoDetailInfo', videoNumber],
    queryFn: () => getVideoDetailInfo(videoNumber, videoType)
  });

  if (isLoading) <div>Loading...</div>;

  const platformArr: platform[] = JSON.parse(videoPlatform).filter((n: platform) => !(n.name === '알수없음'));

  return (
    <div className="flex flex-col w-full items-start">
      <p className="text-Grey-900 body-l-bold">프로그램 정보</p>
      <p className="text-Grey-800 body-s w-[538px] mt-2">{data?.detail.overview}</p>
      <p className="mt-[43.78px] text-Grey-900 body-l-bold">영상 플랫폼</p>
      <div className="flex flex-row mt-[14.22px] gap-2 items-center">
        {platformArr && platformArr.length > 0 ? (
          platformArr.map((platform) => <PlatformImageDetail platform={platform} key={platform.name} />)
        ) : (
          <p>플랫폼 정보가 없습니다</p>
        )}
      </div>
      <p className="text-Grey-900 body-l-bold mt-[35.78px]">출연진</p>
      <div className="flex flex-row gap-5 items-center mt-[8.66px] mb-[154.56px]">
        {data?.credit.map((credit) => {
          return (
            <div key={credit.id} className="flex flex-col w-[78.857px] h-[100px] items-start gap-1 flex-shrink-0">
              <Image
                className="self-stretch"
                src={`https://image.tmdb.org/t/p/w500${credit.profile_path}`}
                width={100}
                height={100}
                alt={credit.name}
              />
              <p className="self-stretch text-Grey-800 body-xs">{credit.original_name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailInfo;

const getVideoDetailInfo = async (videoNumber: number, videoType: string) => {
  if (videoType === 'movie') {
    const movieDetailInfo = await fetchMoviesDetail(videoNumber);
    return movieDetailInfo;
  } else if (videoType === 'tv') {
    const tvDetailInfo = await fetchTvDetail(videoNumber);
    return tvDetailInfo;
  }
};
