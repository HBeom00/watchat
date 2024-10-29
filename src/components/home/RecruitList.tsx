'use client';

import { partyInfo } from '@/types/partyInfo';
import browserClient from '@/utils/supabase/client';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import RecruitCard from './RecruitCard';

const RecruitList = () => {
  const [order, setOrder] = useState<string>('최신순');
  const [filter, setFilter] = useState<string>('전체');
  const { data, isLoading } = useQuery({
    queryKey: ['recruitList'],
    queryFn: async () => {
      const response: PostgrestSingleResponse<partyInfo[]> = await browserClient.from('party_info').select('*');
      if (response.error) {
        console.log(response.error.message);
      }
      return response.data;
    }
  });
  if (isLoading) <div>Loading...</div>;
  console.log(order);

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
        {filterData
          // 최신순   :   시청 날짜가 현재 이전일 경우 뒤로 보내기
          ?.filter((n) => !(n.situation === '종료') && !getExpiration(n.watch_date))
          .sort((a, b) => {
            return (
              Number(a.watch_date.split('-')[0]) - Number(b.watch_date.split('-')[0]) ||
              Number(a.watch_date.split('-')[1]) - Number(b.watch_date.split('-')[1]) ||
              Number(a.watch_date.split('-')[2]) - Number(b.watch_date.split('-')[2])
            );
          })
          .map((recruit) => {
            return <RecruitCard key={recruit.party_id} data={recruit} end={false} />;
          })}
        {filterData
          ?.filter((n) => n.situation === '종료' || getExpiration(n.watch_date))
          .sort((a, b) => {
            return (
              Number(a.watch_date.split('-')[1]) - Number(b.watch_date.split('-')[1]) ||
              Number(a.watch_date.split('-')[2]) - Number(b.watch_date.split('-')[2])
            );
          })
          .map((recruit) => {
            return <RecruitCard key={recruit.party_id} data={recruit} end={true} />;
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
    console.log(Number(watchDataArr[i]) - Number(nowDateArr[i]));
    if (Number(watchDataArr[i]) - Number(nowDateArr[i]) > 0) {
      expiration = false;
    }
  }
  console.log(expiration);
  return expiration;
};
