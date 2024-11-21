'use client';

import { useSearchParams } from 'next/navigation';
import NormalList from './NormalList';

const RecruitList = () => {
  const params = useSearchParams();

  // 모집 필터
  const partySituation = params.get('watch');

  return (
    <div className="w-full">
      <NormalList partySituation={partySituation} />
    </div>
  );
};

export default RecruitList;
