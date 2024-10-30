'use client';

import { partyInfo } from '@/types/partyInfo';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import browserClient from '@/utils/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import RecruitCard from './RecruitCard';

const RecruitList = () => {
  const [order, setOrder] = useState<string>('watch_date');
  const [filter, setFilter] = useState<string>('전체');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const bull = filter === '전체' ? 'name' : filter;
  const start = (pageNumber - 1) * 16;
  const end = pageNumber * 16 - 1;

  // 페이지 수 불러오기
  const { data: pageData, isLoading: isPageLoading } = useQuery({
    queryKey: ['recruitListPages'],
    queryFn: async () => {
      const response: PostgrestSingleResponse<{ party_id: string }[]> = await browserClient
        .from('party_info')
        .select('party_id')
        .order('watch_date', { ascending: false })
        .order(order, { ascending: false })
        .textSearch('video_platform', bull);
      if (response.error) {
        console.log(response.error.message);
      }
      return response.data && response.data.length > 0 ? Math.ceil(response.data?.length / 16) : 1;
    }
  });

  // 데이터 불러오기
  const { data, isLoading } = useQuery({
    queryKey: ['recruitList'],
    queryFn: async () => {
      const response: PostgrestSingleResponse<partyInfo[]> = await browserClient
        .from('party_info')
        .select('*')
        .range(start, end)
        .order('watch_date', { ascending: false })
        .order(order, { ascending: false })
        .textSearch('video_platform', bull);
      if (response.error) {
        console.log(response.error.message);
      }
      return response.data;
    }
  });

  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['recruitList'] });
    queryClient.invalidateQueries({ queryKey: ['recruitListPages'] });
  }, [order, filter, pageNumber, queryClient]);

  if (isLoading || isPageLoading) <div>Loading...</div>;
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
      <div className="flex flex-row gap-10 p-10 justify-center items-center text-xl font-bold">
        {pageData &&
          Array.from({ length: pageData })
            .map((arr, i) => {
              return i + 1;
            })
            .map((page) => {
              return (
                <button key={page} onClick={() => setPageNumber(page)}>
                  {page}
                </button>
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
  let expiration = false;
  for (let i = 0; i < watchDataArr.length; i++) {
    if (!(Number(watchDataArr[i]) - Number(nowDateArr[i]) >= 0)) {
      expiration = true;
    }
  }
  return expiration;
};
