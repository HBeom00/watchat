import { fetchMoviesDetail, fetchTvDetail } from '@/serverActions/TMDB';
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
  return (
    <div>
      <p>프로그램 정보</p>
      <p>{data?.detail.overview}</p>
      <p>영상 플랫폼</p>
      <div className="flex flex-row gap-10">
        {JSON.parse(videoPlatform).map((platform: { name: string; logoUrl: string }) => (
          <Image key={platform.name} src={platform.logoUrl} width={50} height={50} alt={platform.name} />
        ))}
      </div>
      <p>출연진</p>
      <div className="flex flex-row gap-10">
        {data?.credit.map((credit) => {
          return (
            <div key={credit.id}>
              <Image
                src={`https://image.tmdb.org/t/p/w500${credit.profile_path}`}
                width={100}
                height={100}
                alt={credit.name}
              />
              <p>{credit.original_name}</p>
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
