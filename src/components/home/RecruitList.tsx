'use client';

import { partyInfo } from '@/types/partyInfo';
import browserClient from '@/utils/supabase/client';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';

const RecruitList = () => {
  const [order, setOrder] = useState<string>('최신순');
  const [filter, setFilter] = useState<string>('전체');
  const { data, isLoading } = useQuery({
    queryKey: ['recruitList', order, filter],
    queryFn: async () => {
      const response: PostgrestSingleResponse<partyInfo[]> = await browserClient.from('party_info').select('*');
      if (response.error) {
        console.log(response.error.message);
      }
      return response.data;
    }
  });
  if (isLoading) <div>Loading...</div>;

  const filterData =
    filter === '전체'
      ? data
      : data?.filter((n) => {
          return n.video_platform.indexOf(filter) !== -1;
        });

  return (
    <div>
      <div className="flex flex-row gap-5 p-10">
        <form>
          <select name="순" onChange={(e) => setOrder(e.target.value)}>
            <option value={'최신순'}>최신순</option>
            <option value={'인기순'}>인기순</option>
          </select>
        </form>
        <form>
          <select name="채널" onChange={(e) => setFilter(e.target.value)}>
            <option value={'전체'}>전체</option>
            <option value={'넷플릭스'}>넷플릭스</option>
            <option value={'왓챠'}>왓챠</option>
            <option value={'wavve'}>wavve</option>
          </select>
        </form>
      </div>
      <div className="grid grid-cols-4 gap-10 p-10">
        {filterData?.map((recruit) => {
          return (
            <Link href={`/party/${recruit.party_id}`} key={recruit.party_id} className="p-10 bg-gray-200">
              <p>{recruit.party_name}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecruitList;
