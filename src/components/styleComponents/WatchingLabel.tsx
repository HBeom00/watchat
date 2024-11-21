import { getViewStatus } from '@/utils/viewStatus';

type Party = {
  watch_date: string;
  start_time: string;
  duration_time: number;
  situation: string;
};

const WatchingLabel = ({ partyData }: { partyData: Party }) => {
  return (
    <>
      {getViewStatus(partyData) === '시청중' ? (
        <div className="absolute top-3 left-3 text-white label-m-bold bg-primary-400 py-1 px-3 rounded-[8px] flex flex-row items-center gap-1 z-10">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <p>시청중</p>
        </div>
      ) : getViewStatus(partyData) === '모집중' ? (
        <div className="absolute top-3 left-3  text-sm bg-primary-50 py-1 px-3 rounded-[8px] text-primary-400 label-m-bold z-10">
          <p>{partyData.situation}</p>
        </div>
      ) : (
        <div className="absolute top-3 left-3 text-white text-sm bg-[#424242] py-1 px-3 rounded-[8px] label-m-bold z-10">
          <p>{getViewStatus(partyData)}</p>
        </div>
      )}
    </>
  );
};

export default WatchingLabel;
