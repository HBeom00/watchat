'use client';

import { partyInfo } from '@/types/partyInfo';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import browserClient from '@/utils/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import RecruitCard from './RecruitCard';
import { getViewStatus } from '@/utils/viewStatus';
import { useSearchStore } from '@/providers/searchStoreProvider';
import { useWatchFilter } from '@/store/watchFilterStore';
import { selectClass } from '@/customCSS/platform';

const RecruitList = () => {
  const queryClient = useQueryClient();
  const [order, setOrder] = useState<string>('start_date_time');
  const [filter, setFilter] = useState<string>('전체');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const searchWord = useSearchStore((state) => state.searchText);

  const partySituation = useWatchFilter((state) => state.partySituation);

  const pageSlice = 16;
  const start = (pageNumber - 1) * pageSlice;
  const end = pageNumber * pageSlice - 1;

  const bull = filter === '전체' ? 'name' : filter;

  const wordConversion = searchWord
    .split(' ')
    .map((n) => {
      return `${n}+`;
    })
    .join('');

  // 현재시간
  const d = new Date();
  d.setHours(d.getHours() + 9);
  const now = d.toISOString();

  // 시청 중, 모집 중을 완벽하게 구현하려면 startTime과 endTime이 supabase에 들어가야한다

  // 페이지 수 불러오기
  // 유효하지 않은 데이터 때문에 페이지네이션 오류
  const { data: pageData, isLoading: isPageLoading } = useQuery({
    queryKey: ['recruitListPages'],
    queryFn: async () => {
      const response: PostgrestSingleResponse<{ party_id: string }[]> =
        wordConversion === '+'
          ? // 검색을 안하는 경우
            partySituation === '모집중'
            ? await browserClient
                .from('party_info')
                .select('party_id')
                .order('start_date_time', { ascending: false })
                .order(order, { ascending: false })
                .gte('start_date_time', now)
                .textSearch('video_platform', bull)
            : partySituation === '시청중'
            ? await browserClient
                .from('party_info')
                .select('party_id')
                .order('start_date_time', { ascending: false })
                .order(order, { ascending: false })
                .lte('start_date_time', now)
                .gte('end_time', now)
                .textSearch('video_platform', bull)
            : await browserClient
                .from('party_info')
                .select('party_id')
                .order('start_date_time', { ascending: false })
                .order(order, { ascending: false })
                .textSearch('video_platform', bull)
          : // 검색을 하는 경우
          partySituation === '모집중'
          ? await browserClient
              .from('party_info')
              .select('party_id')
              .order('start_date_time', { ascending: false })
              .order(order, { ascending: false })
              .textSearch('video_platform', bull)
              .gte('start_date_time', now)
              .textSearch('video_name', wordConversion)
          : partySituation === '시청중'
          ? await browserClient
              .from('party_info')
              .select('party_id')
              .order('start_date_time', { ascending: false })
              .order(order, { ascending: false })
              .lte('start_date_time', now)
              .gte('end_time', now)
              .textSearch('video_platform', bull)
              .textSearch('video_name', wordConversion)
          : await browserClient
              .from('party_info')
              .select('party_id')
              .order('start_date_time', { ascending: false })
              .order(order, { ascending: false })
              .textSearch('video_platform', bull)
              .textSearch('video_name', wordConversion);
      if (response.error) {
        console.log(response.error.message);
      }

      return response.data && response.data.length > 0 ? Math.ceil(response.data?.length / pageSlice) : 1;
    }
  });

  // 데이터 불러오기
  const { data, isLoading } = useQuery({
    queryKey: ['recruitList'],
    queryFn: async () => {
      const response: PostgrestSingleResponse<partyInfo[]> =
        // 검색을 안하는 경우
        wordConversion === '+'
          ? // 모집중을 택할 때 watch_date가 오늘 이상인 데이터 불러오기
            partySituation === '모집중'
            ? await browserClient
                .from('party_info')
                .select('*')
                .range(start, end)
                .order('start_date_time', { ascending: false })
                .order(order, { ascending: false })
                .gte('start_date_time', now)
                .textSearch('video_platform', bull)
            : partySituation === '시청중'
            ? await browserClient
                .from('party_info')
                .select('*')
                .range(start, end)
                .order('start_date_time', { ascending: false })
                .order(order, { ascending: false })
                .lte('start_date_time', now)
                .gte('end_time', now)
                .textSearch('video_platform', bull)
            : await browserClient
                .from('party_info')
                .select('*')
                .range(start, end)
                .order('start_date_time', { ascending: false })
                .order(order, { ascending: false })
                .textSearch('video_platform', bull)
          : //검색을 하는 경우
          partySituation === '모집중'
          ? await browserClient
              .from('party_info')
              .select('*')
              .range(start, end)
              .order('start_date_time', { ascending: false })
              .order(order, { ascending: false })
              .textSearch('video_platform', bull)
              .gte('start_date_time', now)
              .textSearch('video_name', wordConversion)
          : partySituation === '시청중'
          ? await browserClient
              .from('party_info')
              .select('*')
              .range(start, end)
              .order('start_date_time', { ascending: false })
              .order(order, { ascending: false })
              .lte('start_date_time', now)
              .gte('end_time', now)
              .textSearch('video_platform', bull)
              .textSearch('video_name', wordConversion)
          : await browserClient
              .from('party_info')
              .select('*')
              .range(start, end)
              .order('start_date_time', { ascending: false })
              .order(order, { ascending: false })
              .textSearch('video_platform', bull)
              .textSearch('video_name', wordConversion);

      if (response.error) {
        console.log(response.error.message);
      }

      return response.data;
    }
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['recruitList'] });
    queryClient.invalidateQueries({ queryKey: ['recruitListPages'] });
  }, [order, filter, pageNumber, searchWord, partySituation, queryClient]);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['recruitList'] });
    queryClient.invalidateQueries({ queryKey: ['recruitListPages'] });
    setPageNumber(1);
  }, [order, filter, searchWord, partySituation, queryClient]);

  if (isLoading || isPageLoading) <div>Loading...</div>;

  return (
    <div className="mt-8">
      <div className="inline-flex items-center gap-2">
        <select
          className={selectClass}
          name="순서"
          onChange={(e) => {
            setOrder(e.target.value);
          }}
        >
          <option value={'start_date_time'}>최신순</option>
          <option value={'popularity'}>인기순</option>
        </select>
        <select
          className={selectClass}
          name="채널"
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        >
          <option value={'전체'} hidden>
            구독 채널
          </option>
          <option value={'전체'}>전체</option>
          <option value={'Netflix'}>넷플릭스</option>
          <option value={'Tving'}>티빙</option>
          <option value={'wavve'}>웨이브</option>
          <option value={'Disney'}>디즈니플러스</option>
          <option value={'Coupang'}>쿠팡플레이</option>
          <option value={'Watcha'}>왓챠</option>
        </select>
      </div>
      <div className="grid grid-cols-5 gap-x-5 gap-y-8 mt-8">
        {data && data.length > 0 ? (
          data.map((recruit) => {
            return (
              <RecruitCard
                key={recruit.party_id}
                data={recruit}
                end={recruit.situation === '종료' || getViewStatus(recruit) === '시청완료'}
              />
            );
          })
        ) : (
          <p>데이터가 없습니다</p>
        )}
      </div>
      <div className="flex flex-row gap-10 p-10 justify-center items-center text-xl">
        <button onClick={() => setPageNumber(1)}>가장 처음으로</button>
        <button onClick={() => setPageNumber((now) => (now !== 1 ? now - 1 : now))}>&#12296;</button>
        {pageData &&
          Array.from({ length: pageData })
            .map((arr, i) => {
              return i + 1;
            })
            .map((page) => {
              return (
                <button
                  className={page === pageNumber ? 'w-8 bg-purple-700 rounded-full text-white' : ''}
                  key={page}
                  onClick={() => setPageNumber(page)}
                >
                  {page}
                </button>
              );
            })}
        <button onClick={() => setPageNumber((now) => (now !== pageData ? now + 1 : now))}>&#12297;</button>
        <button onClick={() => setPageNumber(pageData ? pageData : 1)}>가장 마지막으로</button>
      </div>
    </div>
  );
};

export default RecruitList;
