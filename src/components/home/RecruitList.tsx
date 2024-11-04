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

const RecruitList = () => {
  const queryClient = useQueryClient();
  // 정렬과 필터 상태값
  const [order, setOrder] = useState<string>('start_date_time');
  const [filter, setFilter] = useState<string>('전체');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const searchWord = useSearchStore((state) => state.searchText);
  const partySituation = useWatchFilter((state) => state.partySituation);

  // 페이지, 필터, 검색 등의 상태값 재정리
  // 페이지
  const pageSlice = 16;
  const start = (pageNumber - 1) * pageSlice;
  const end = pageNumber * pageSlice - 1;

  // 플랫폼 필터
  const bull = filter === '전체' ? 'name' : filter;

  // 검색
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

  // 페이지 수 불러오기
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
          ? partySituation === '모집중'
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

  // 필터 누르면 데이터가 바로 바뀌도록
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
          className="selectClass"
          name="순서"
          onChange={(e) => {
            setOrder(e.target.value);
          }}
        >
          <option value={'start_date_time'}>최신순</option>
          <option value={'popularity'}>인기순</option>
        </select>
        <select
          className="selectClass"
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
          <>
            {data
              .filter((n) => getViewStatus(n) === '시청중')
              ?.map((recruit) => {
                return (
                  <RecruitCard
                    key={recruit.party_id}
                    data={recruit}
                    end={recruit.situation === '종료' || getViewStatus(recruit) === '시청완료'}
                  />
                );
              })}
            {data
              .filter((n) => getViewStatus(n) !== '시청중')
              ?.map((recruit) => {
                return (
                  <RecruitCard
                    key={recruit.party_id}
                    data={recruit}
                    end={recruit.situation === '종료' || getViewStatus(recruit) === '시청완료'}
                  />
                );
              })}
          </>
        ) : (
          <p>데이터가 없습니다</p>
        )}
      </div>
      {/* 페이지 셀렉트 */}
      <div className="flex w-full mt-[31.5px] mb-[29.5px] justify-center items-center">
        <div className="flex flex-row gap-1 justify-center items-center text-static-black body-xs ">
          <button onClick={() => setPageNumber(1)} className="p-[10px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M10.75 0.596249L11.8038 1.65L7.20375 6.25L11.8038 10.85L10.75 11.9037L5.09625 6.25L10.75 0.596249ZM1.5 0.5L1.5 12H1.00536e-06L0 0.5L1.5 0.5Z"
                fill="#2A2A2A"
              />
            </svg>
          </button>
          <button onClick={() => setPageNumber((now) => (now !== 1 ? now - 1 : now))} className="px-3 py-[10px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="7" height="13" viewBox="0 0 7 13" fill="none">
              <path
                d="M2.1075 6.50043L6.7075 11.1004L5.65375 12.1542L0 6.50043L5.65375 0.84668L6.7075 1.90043L2.1075 6.50043Z"
                fill="#2A2A2A"
              />
            </svg>
          </button>
          {pageData &&
            Array.from({ length: pageData })
              .map((arr, i) => {
                return i + 1;
              })
              .map((page) => {
                return (
                  <button
                    className={
                      page === pageNumber
                        ? 'flex w-8 h-8 bg-primary-400 rounded-full justify-center items-center self-stretch text-static-white text-center'
                        : 'flex w-8 h-8 justify-center items-center self-stretch text-center'
                    }
                    key={page}
                    onClick={() => setPageNumber(page)}
                  >
                    {page}
                  </button>
                );
              })}
          <button onClick={() => setPageNumber((now) => (now !== pageData ? now + 1 : now))} className="px-3 py-[10px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="7" height="13" viewBox="0 0 7 13" fill="none">
              <path
                d="M4.6 6.50043L0 1.90043L1.05375 0.84668L6.7075 6.50043L1.05375 12.1542L0 11.1004L4.6 6.50043Z"
                fill="#2A2A2A"
              />
            </svg>
          </button>
          <button onClick={() => setPageNumber(pageData ? pageData : 1)} className="p-[10px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1.05375 11.9038L0 10.85L4.6 6.25L0 1.65L1.05375 0.596249L6.7075 6.25L1.05375 11.9038ZM10.3038 12V0.5H11.8038V12H10.3038Z"
                fill="#2A2A2A"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruitList;
