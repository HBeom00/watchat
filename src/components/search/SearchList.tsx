'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import getSearchListPage from '@/reactQuery/queryFunc/Home/getSearchListPage';
import getSearchList from '@/reactQuery/queryFunc/Home/getSearchList';

import Image from 'next/image';
import SelectDropBox from '../home/SelectDropBox';
import ListDiv from '../home/ListDiv';
import PageSelect from '../home/PageSelect';

import type { filter, order } from '@/types/filter';
import Loading from '@/app/loading';

const SearchList = ({ search }: { search: string }) => {
  const queryClient = useQueryClient();
  const params = useSearchParams();

  const [order, setOrder] = useState<order>('write_time');
  const [filter, setFilter] = useState<filter>('전체');
  const [pageNumber, setPageNumber] = useState<number>(1);

  // 모집 필터
  const partySituation = params.get('watch');
  // 검색 필터
  const searchWord = decodeURIComponent(search);
  let wordConversion = searchWord
    .split(' ')
    .map((n) => {
      return `%${n}%`;
    })
    .join('');
  wordConversion = wordConversion === '%null%' ? '+' : wordConversion;

  // 페이지 수 불러오기
  const { data: pageData, isLoading: isPageLoading } = useQuery({
    queryKey: ['searchListPages'],
    queryFn: async () => {
      const allPage = await getSearchListPage(wordConversion, partySituation, filter);
      return allPage;
    }
  });

  // 데이터 불러오기
  const { data, isLoading } = useQuery({
    queryKey: ['searchList'],
    queryFn: async () => {
      const data = await getSearchList(wordConversion, partySituation, pageNumber, order, filter);

      return data;
    }
  });

  // 필터 누르면 데이터가 바로 바뀌도록
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['searchListPages'] });
    queryClient.invalidateQueries({ queryKey: ['searchList'] });
  }, [order, filter, pageNumber, searchWord, partySituation, queryClient]);

  useEffect(() => {
    setPageNumber(1);
  }, [searchWord, partySituation, queryClient]);

  if (isLoading || isPageLoading) <Loading />;

  return (
    <div className={`w-full`}>
      {data && data.length > 0 ? (
        <div>
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
      ) : (
        <div className="flex flex-col justify-center items-center gap-2 pt-12 pb-[100px] h-[510px]">
          <Image src={'/searchCat.svg'} width={116} height={100} alt="검색 결과가 없습니다" />
          <div className="flex flex-col gap-1 ">
            <div className="flex flex-row text-center body-l-bold text-Grey-500">
              <p className="text-[#FB6362]">&#39;{searchWord}&#39;</p>
              <p>에 대한 검색 결과가 없습니다.</p>
            </div>
            <p className="body-s text-Grey-500">키워드를 정확하게 입력하셨는지 확인해보세요.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchList;
