import { fetchMoviesDetail, fetchTvDetail } from '@/serverActions/TMDB';

const DetailInfo = ({ videoNumber, videoType }: { videoNumber: number | null; videoType: string | null }) => {
  // 영상 넘버로 영상정보 API 불러오기
  return (
    <div>
      <p>영상 상세정보</p>
      <p>정보가 생기면 불러오자....</p>
    </div>
  );
};

export default DetailInfo;

// const getVideoDetailInfo = async (videoNumber: string, videoType: string) => {
//   if (videoType === 'movie') {
//     await fetchMoviesDetail(videoNumber);
//   } else if (videoType === 'TV') {
//     await fetchTvDetail(videoNumber);
//   }
// };
