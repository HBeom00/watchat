'use client';

import { partyInfo } from '@/types/partyInfo';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import browserClient from '@/utils/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import RecruitCard from './RecruitCard';

const RecruitList = () => {
  const [order, setOrder] = useState<string>('최신순');
  const [filter, setFilter] = useState<string>('전체');
  // const [pageNumber,setPageNumber] = useState<number>(1)
  const queryClient = useQueryClient();

  const bull = filter === '전체' ? 'name' : filter;
  queryClient.invalidateQueries({ queryKey: ['recruitList'] });
  const { data, isLoading } = useQuery({
    queryKey: ['recruitList'],
    queryFn: async () => {
      const response: PostgrestSingleResponse<partyInfo[]> = await browserClient
        .from('party_info')
        .select('*')
        .range(0, 15)
        .order('watch_date', { ascending: false })
        // .order(order, { ascending: false })
        .textSearch('video_platform', bull);
      if (response.error) {
        console.log(response.error.message);
      }
      return response.data;
    }
  });
  if (isLoading) <div>Loading...</div>;
  console.log(data, order);
  return (
    <div>
      <div className="flex flex-row gap-5 p-10">
        <form>
          <select
            name="순서"
            onChange={(e) => {
              setOrder(e.target.value);
            }}
          >
            <option value={'watch_date'}>최신순</option>
            <option value={'popularity'}>인기순</option>
          </select>
        </form>
        <form>
          <select
            name="채널"
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          >
            <option value={'전체'}>전체</option>
            <option value={'Netflix'}>넷플릭스</option>
            <option value={'Tving'}>티빙</option>
            <option value={'wavve'}>웨이브</option>
            <option value={'Disney'}>디즈니플러스</option>
            <option value={'Coupang'}>쿠팡플레이</option>
            <option value={'Watcha'}>왓챠</option>
          </select>
        </form>
      </div>
      <div className="grid grid-cols-4 gap-10 p-10">
        {data?.map((recruit) => {
          return (
            <RecruitCard
              key={recruit.party_id}
              data={recruit}
              end={recruit.situation === '종료' || getExpiration(recruit.watch_date)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RecruitList;

// 시청날짜가 지났을 때
// true면 지난 것 false면 안 지난 것
const getExpiration = (watchDate: string) => {
  let nowDateArr = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Seoul' }).split('/');
  nowDateArr = [nowDateArr[2], nowDateArr[0], nowDateArr[1]];
  const watchDataArr = watchDate.split('-');
  let expiration = true;
  for (let i = 0; i < watchDataArr.length; i++) {
    // console.log(Number(watchDataArr[i]) - Number(nowDateArr[i]));
    if (Number(watchDataArr[i]) - Number(nowDateArr[i]) > 0) {
      expiration = false;
    }
  }
  // console.log(watchDate, expiration);
  return expiration;
};
