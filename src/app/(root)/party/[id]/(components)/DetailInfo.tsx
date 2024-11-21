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
    <div className="flex flex-col w-full items-start gap-[32px]">
      <div className="flex flex-col items-start gap-[8px] self-stretch">
        <p className="text-Grey-900 body-l-bold">프로그램 정보</p>
        <p
          className={`text-Grey-800 body-s w-[539px]
        mobile:w-full`}
        >
          {data?.detail.overview}
        </p>
      </div>
      <div className="flex flex-col items-start gap-[8px] self-stretch">
        <p className="text-Grey-900 body-l-bold">영상 플랫폼</p>
        <div className="flex flex-row gap-[8px] items-center">
          {platformArr && platformArr.length > 0 ? (
            platformArr.map((platform) => <PlatformImageDetail platform={platform} key={platform.name} />)
          ) : (
            <p>플랫폼 정보가 없습니다</p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-start gap-[8px] self-stretch mb-[64px]">
        <p className="text-Grey-900 body-l-bold">출연진</p>
        {data && data.credit.length > 0 ? (
          <div
            className={`flex flex-row gap-[16px] items-center self-stretch
      mobile:grid mobile:grid-cols-3`}
          >
            {data?.credit
              .filter((n) => !!n.profile_path)
              .map((credit) => {
                return (
                  <div key={credit.id} className="flex flex-col items-start gap-1 flex-shrink-0">
                    <div className="relative w-[80px] h-[100px]">
                      <Image
                        className="self-stretch"
                        src={`https://image.tmdb.org/t/p/w500${credit.profile_path}`}
                        style={{ objectFit: 'cover' }}
                        fill
                        alt={credit.name}
                      />
                    </div>
                    <p className="self-stretch text-Grey-800 body-xs">{credit.original_name}</p>
                  </div>
                );
              })}
          </div>
        ) : (
          <p>출연진 정보가 없습니다</p>
        )}
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
