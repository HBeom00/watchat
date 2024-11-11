'use client';

import { partyInfo } from '@/types/partyInfo';
import {
  endDataNumber,
  nowTime,
  pageSlice,
  platformConversion,
  startDataNumber
} from '@/utils/mainPageData/pageFilter';
import browserClient from '@/utils/supabase/client';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import SelectDropBox from './SelectDropBox';
import ListDiv from './ListDiv';
import PageSelect from './PageSelect';

const FilteringList = () => {
  const params = useSearchParams();

  const [order, setOrder] = useState<string>('write_time');
  const [filter, setFilter] = useState<string>('전체');
  const [pageNumber, setPageNumber] = useState<number>(1);

  const searchWord = decodeURIComponent(params.get('search') + '');
  let wordConversion = searchWord
    .split(' ')
    .map((n) => {
      return `${n}+`;
    })
    .join('');
  wordConversion = wordConversion === 'null+' ? '+' : wordConversion;

  // 페이지 수 불러오기
  const { data: pageData, isLoading: isPageLoading } = useQuery({
    queryKey: ['recruitListPages'],
    queryFn: async () => {
      const response = await browserClient
        .from('party_info')
        .select('party_id')
        .gte('end_time', nowTime()) // 종료 시간이 지나지 않은 경우만
        .textSearch('video_platform', platformConversion(filter))
        .textSearch('video_name', wordConversion); // 검색어
      const allPage = response.data && response.data.length > 0 ? Math.ceil(response.data?.length / pageSlice) : 1;
      return allPage;
    }
  });

  const { data, isLoading } = useQuery({
    queryKey: ['recruitList', 'search'],
    queryFn: async () => {
      const response: PostgrestSingleResponse<partyInfo[]> = await browserClient
        .from('party_info')
        .select('*')
        .range(startDataNumber(pageNumber), endDataNumber(pageNumber))
        .order(order, { ascending: false })
        .gte('end_time', nowTime()) // 종료 시간이 지나지 않은 경우만
        .textSearch('video_platform', platformConversion(filter))
        .textSearch('video_name', wordConversion); // 검색어

      if (response.data && response.data.length > 0) {
        return response.data;
      }
      return [];
    }
  });
  if (isLoading || isPageLoading) <div>Loading......</div>;
  return (
    <div className="mt-8 w-[1060px]">
      <SelectDropBox
        order={order}
        setOrder={setOrder}
        filter={filter}
        setFilter={setFilter}
        setPageNumber={setPageNumber}
      />
      <ListDiv data={data} />
      <PageSelect pageData={pageData} pageNumber={pageNumber} setPageNumber={setPageNumber} />
    </div>
  );
};

export default FilteringList;
