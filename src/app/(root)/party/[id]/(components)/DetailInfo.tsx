import { fetchMoviesDetail } from '@/serverActions/TMDB';

const DetailInfo = async ({ videoNumber, videoType }: { videoNumber: string | null; videoType: string | null }) => {
  // 영상 넘버로 영상정보 API 불러오기
  return (
    <div>
      <p>영상 상세정보</p>
      <p>정보가 생기면 불러오자....</p>
    </div>
  );
};

export default DetailInfo;

// const getVideoDetailInfo = async(videoNumber:string,videoType:string)=>{
//   if(videoType==='영화'){
//     await fetchMoviesDetail(videoNumber)

//   }else if(

//     videoType==='드라마'
//   ) {
//     await fetchTvDetail(videoNumber)
//   }
// }
