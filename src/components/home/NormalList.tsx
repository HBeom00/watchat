'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import SelectDropBox from './SelectDropBox';
import ListDiv from './ListDiv';
import PageSelect from './PageSelect';
import getRecruitList from '@/reactQuery/queryFunc/Home/getRecruitList';
import getRecruitListPage from '@/reactQuery/queryFunc/Home/getRecruitListPage';
import Image from 'next/image';
import { filter, order } from '@/types/filter';

const NormalList = ({ partySituation }: { partySituation: string | null }) => {
  const queryClient = useQueryClient();

  const [order, setOrder] = useState<order>('write_time');
  const [filter, setFilter] = useState<filter>('전체');
  const [pageNumber, setPageNumber] = useState<number>(1);

  // 페이지 수 불러오기
  const { data: pageData, isLoading: isPageLoading } = useQuery({
    queryKey: ['recruitListPages'],
    queryFn: async () => {
      const allPage = await getRecruitListPage(partySituation, filter);
      return allPage;
    }
  });

  // 데이터 불러오기
  const { data, isLoading } = useQuery({
    queryKey: ['recruitList'],
    queryFn: async () => {
      const data = await getRecruitList(partySituation, pageNumber, order, filter);

      return data;
    }
  });

  // 필터 누르면 데이터가 바로 바뀌도록
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['recruitList'] });
    queryClient.invalidateQueries({ queryKey: ['recruitListPages'] });
  }, [order, filter, pageNumber, partySituation, queryClient]);

  // 페이지 리셋
  useEffect(() => {
    setPageNumber(1);
  }, [partySituation, queryClient]);

  if (isLoading || isPageLoading) <div>Loading...</div>;

  return (
    <div>
      <SelectDropBox
        order={order}
        setOrder={setOrder}
        filter={filter}
        setFilter={setFilter}
        setPageNumber={setPageNumber}
      />
      {data && data.length > 0 ? (
        <ListDiv data={data} />
      ) : (
        <div className="w-full h-80 flex flex-col items-center justify-center self-stretch">
          <Image src={'/cryingCat.svg'} width={73} height={64} className="p-[8px]" alt="데이터가 없습니다" />
          <p className="self-stretch text-Grey-500 text-center body-m">
            {partySituation === 'current'
              ? '시청중인 파티가 없습니다.'
              : partySituation === 'recruiting'
              ? '모집중인 파티가 없습니다.'
              : '데이터가 없습니다'}
          </p>
        </div>
      )}

      <PageSelect pageData={pageData} pageNumber={pageNumber} setPageNumber={setPageNumber} />
    </div>
  );
};

export default NormalList;
