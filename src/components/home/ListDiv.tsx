'use client';

import { partyInfo } from '@/types/partyInfo';
import RecruitCard from './RecruitCard';
import { getViewStatus } from '@/utils/viewStatus';
import Link from 'next/link';
import { useState } from 'react';
import PrivateModal from './PrivateModal';

const ListDiv = ({ data }: { data: partyInfo[] | undefined }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="grid grid-cols-5 gap-x-5 gap-y-8 mt-8">
      {data && data.length > 0 ? (
        <>
          {data
            .filter((n) => getViewStatus(n) === '시청중')
            ?.map((recruit) => {
              return (
                <>
                  {recruit.privacy_setting ? (
                    <Link key={recruit.party_id} href={`/party/${recruit.party_id}`}>
                      <RecruitCard data={recruit} end={getViewStatus(recruit) === '시청완료'} />
                    </Link>
                  ) : (
                    <div key={recruit.party_id} onClick={() => setOpen(true)}>
                      <RecruitCard data={recruit} end={getViewStatus(recruit) === '시청완료'} />
                    </div>
                  )}
                </>
              );
            })}
          {data
            .filter((n) => getViewStatus(n) !== '시청중')
            ?.map((recruit) => {
              return (
                <>
                  {recruit.privacy_setting ? (
                    <Link key={recruit.party_id} href={`/party/${recruit.party_id}`}>
                      <RecruitCard data={recruit} end={getViewStatus(recruit) === '시청완료'} />
                    </Link>
                  ) : (
                    <div key={recruit.party_id} onClick={() => setOpen(true)}>
                      <RecruitCard data={recruit} end={getViewStatus(recruit) === '시청완료'} />
                    </div>
                  )}
                </>
              );
            })}
        </>
      ) : (
        <div className="w-full h-52">
          <p>데이터가 없습니다</p>
        </div>
      )}

      <PrivateModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default ListDiv;
