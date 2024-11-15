'use client';

import { partyInfo } from '@/types/partyInfo';
import RecruitCard from './RecruitCard';
import { getViewStatus } from '@/utils/viewStatus';
import Link from 'next/link';
import { useState } from 'react';
import PrivateModal from './PrivateModal';

const ListDiv = ({ data }: { data: partyInfo[] }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="grid grid-cols-5 gap-x-5 gap-y-8 mt-8">
      {
        <>
          {data
            .filter((n) => getViewStatus(n) === '시청중')
            .concat(data.filter((n) => getViewStatus(n) !== '시청중'))
            ?.map((recruit) => {
              return (
                <div key={recruit.party_id}>
                  {recruit.privacy_setting ? (
                    <Link href={`/party/${recruit.party_id}`}>
                      <RecruitCard data={recruit} end={getViewStatus(recruit) === '시청완료'} />
                    </Link>
                  ) : (
                    <div onClick={() => setOpen(true)}>
                      <RecruitCard data={recruit} end={getViewStatus(recruit) === '시청완료'} />
                    </div>
                  )}
                </div>
              );
            })}
        </>
      }

      <PrivateModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default ListDiv;
