'use client';

import { partyInfo } from '@/types/partyInfo';
import RecruitCard from './RecruitCard';
import { getViewStatus } from '@/utils/viewStatus';

const ListDiv = ({ data }: { data: partyInfo[] | undefined }) => {
  return (
    <div className="grid grid-cols-5 gap-x-5 gap-y-8 mt-8">
      {data && data.length > 0 ? (
        <>
          {data
            .filter((n) => getViewStatus(n) === '시청중')
            ?.map((recruit) => {
              return <RecruitCard key={recruit.party_id} data={recruit} end={getViewStatus(recruit) === '시청완료'} />;
            })}
          {data
            .filter((n) => getViewStatus(n) !== '시청중')
            ?.map((recruit) => {
              return <RecruitCard key={recruit.party_id} data={recruit} end={getViewStatus(recruit) === '시청완료'} />;
            })}
        </>
      ) : (
        <div className="w-full h-52">
          <p>데이터가 없습니다</p>
        </div>
      )}
    </div>
  );
};

export default ListDiv;
