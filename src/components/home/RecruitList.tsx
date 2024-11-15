'use client';

import { useSearchParams } from 'next/navigation';
import SearchList from './SearchList';
import NormalList from './NormalList';

const RecruitList = () => {
  const params = useSearchParams();

  // 모집 필터
  const partySituation = params.get('watch');

  // 검색 필터
  const searchWord = params.get('search');

  return (
    <div className="mt-8 w-full">
      {searchWord !== null ? (
        <SearchList partySituation={partySituation} />
      ) : (
        <NormalList partySituation={partySituation} />
      )}
    </div>
  );
};

export default RecruitList;
