'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import RecruitCard from './RecruitCard';
import { getViewStatus } from '@/utils/viewStatus';
import getRecruitList from '@/utils/recruitList';
import getRecruitListPage from '@/utils/recuritListPage';
import { useSearchParams } from 'next/navigation';
import PageSelect from './PageSelect';
import SelectDropBox from './SelectDropBox';

const RecruitList = () => {
  const queryClient = useQueryClient();
  const params = useSearchParams();

  // 정렬과 필터 상태값
  // const [order, setOrder] = useState<string>('write_time');
  // const [filter, setFilter] = useState<string>('전체');
  const [pageNumber, setPageNumber] = useState<number>(1);

  const partySituation = params.get('watch');
  const order = params.get('order') !== null ? params.get('order') + '' : 'write_time';
  const filter = params.get('filter');
  // 페이지, 필터, 검색 등의 상태값 재정리
  // 페이지
  const pageSlice = 10;
  const start = (pageNumber - 1) * pageSlice;
  const end = pageNumber * pageSlice - 1;

  // 플랫폼 필터
  const bull = filter === 'all' || filter === null ? 'name' : filter;

  const searchWord = decodeURIComponent(params.get('search') + '');
  let wordConversion = searchWord
    .split(' ')
    .map((n) => {
      return `${n}+`;
    })
    .join('');
  wordConversion = wordConversion === 'null+' ? '+' : wordConversion;

  // 현재시간
  const d = new Date();
  d.setHours(d.getHours() + 9);
  const now = d.toISOString();

  // 페이지 수 불러오기
  const { data: pageData, isLoading: isPageLoading } = useQuery({
    queryKey: ['recruitListPages'],
    queryFn: async () => {
      const allPage = await getRecruitListPage(wordConversion, partySituation, bull, now, pageSlice);
      return allPage;
    }
  });

  // 데이터 불러오기
  const { data, isLoading } = useQuery({
    queryKey: ['recruitList'],
    queryFn: async () => {
      const data = await getRecruitList(wordConversion, partySituation, start, end, order, bull, now);

      return data;
    }
  });

  // 필터 누르면 데이터가 바로 바뀌도록
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['recruitList'] });
    queryClient.invalidateQueries({ queryKey: ['recruitListPages'] });
  }, [order, filter, pageNumber, searchWord, partySituation, queryClient]);

  // 페이지 리셋
  // 추후 리펙토링 필요
  // 페이지를 query로 관리하는 등의
  useEffect(() => {
    setPageNumber(1);
  }, [filter, searchWord, partySituation, queryClient]);

  if (isLoading || isPageLoading) <div>Loading...</div>;

  return (
    <div className="mt-8 w-[1060px]">
      {wordConversion !== '+' && (!data || !(data.length > 0)) ? (
        <div className="flex flex-col justify-center items-center gap-2 pt-12 pb-[100px] h-[510px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="116" height="100" viewBox="0 0 116 100" fill="none">
            <g clipPath="url(#clip0_1054_74684)">
              <path
                d="M106.461 40.4483C104.103 35.2414 100.524 30.7059 97.6013 25.7168L97.5193 25.5807C95.334 21.9069 93.3489 17.6253 91.6552 13.3528C89.4607 8.01901 85.6545 -2.08621 77.6961 0.372058C69.4827 2.81219 63.0996 24.3833 53.9027 24.3652C45.8077 24.3198 37.5761 2.14093 30.4281 0.399272C19.7288 -2.33113 16.56 17.2534 12.9177 23.4399C9.16611 31.7581 4.4038 37.5455 2.05451 46.0451C-6.7963 79.1456 16.5145 95.9363 55.2686 95.9363C103.556 95.9363 117.579 64.1148 106.443 40.4392L106.461 40.4483ZM41.6919 59.3706C38.6961 59.3706 37.1572 57.0847 37.1572 53.8282C37.1572 51.1703 38.4229 47.7233 40.1986 45.0745H44.3144C43.0487 47.4058 42.393 49.22 42.2565 50.9435C44.4965 51.0796 46.09 52.6671 46.09 55.089C46.09 57.511 44.3599 59.3706 41.701 59.3706H41.6919ZM69.6648 59.3706C66.669 59.3706 65.1301 57.0847 65.1301 53.8282C65.1301 51.1703 66.3958 47.7233 68.1715 45.0745H72.2873C71.0216 47.4058 70.3659 49.22 70.2294 50.9435C72.4694 51.0796 74.0629 52.6671 74.0629 55.089C74.0629 57.511 72.3328 59.3706 69.6739 59.3706H69.6648ZM55.1229 67.3804C53.4657 67.3804 52.118 66.0379 52.118 64.3869C52.118 62.736 53.4657 61.3935 55.1229 61.3935C56.7802 61.3935 58.1278 62.736 58.1278 64.3869C58.1278 66.0379 56.7802 67.3804 55.1229 67.3804Z"
                fill="#DCDCDC"
              />
              <path
                d="M102.126 78.1568L94.3587 69.376C93.439 68.3418 92.1005 67.9155 90.8257 68.1151L87.6751 64.5592C90.3704 61.5839 91.973 57.8193 92.228 53.7555C92.5285 48.9931 90.944 44.3941 87.7752 40.811C84.6064 37.2279 80.2266 35.0962 75.446 34.7968C70.6655 34.4975 66.0489 36.0668 62.4521 39.2326C58.8553 42.3894 56.7155 46.7526 56.415 51.5149C56.1145 56.2773 57.6989 60.8763 60.8677 64.4594C64.0365 68.0425 68.4164 70.1742 73.1969 70.4736C74.3716 70.5461 75.528 70.5098 76.6662 70.3647C79.489 70.0019 82.1752 68.9587 84.5245 67.3259L87.6751 70.8818C87.32 72.1154 87.5749 73.4942 88.4946 74.5283L96.2618 83.3092C97.6914 84.9238 100.159 85.0781 101.78 83.6539C103.401 82.2297 103.556 79.7715 102.126 78.1568ZM73.4701 66.3008C69.8096 66.0741 66.4495 64.4322 64.0183 61.6927C61.5871 58.9442 60.376 55.4246 60.6127 51.778C60.8404 48.1314 62.4885 44.7841 65.2385 42.3622C67.3237 40.5389 69.846 39.3959 72.5322 39.0512C73.4063 38.9423 74.2896 38.9061 75.1911 38.9605C78.8516 39.1873 82.2116 40.8291 84.6429 43.5686C87.0741 46.3172 88.2852 49.8368 88.0484 53.4834C87.8117 57.1299 86.1726 60.4772 83.4227 62.8992C80.6636 65.3212 77.1306 66.5276 73.4701 66.2918V66.3008Z"
                fill="#F5F5F5"
              />
              <path
                d="M101.443 99.9995C109.379 99.9995 115.812 93.5908 115.812 85.6853C115.812 77.7798 109.379 71.3711 101.443 71.3711C93.5074 71.3711 87.0742 77.7798 87.0742 85.6853C87.0742 93.5908 93.5074 99.9995 101.443 99.9995Z"
                fill="#E8E8E8"
              />
            </g>
            <defs>
              <clipPath id="clip0_1054_74684">
                <rect width="115.625" height="100" fill="white" transform="translate(0.1875)" />
              </clipPath>
            </defs>
          </svg>
          <div className="flex flex-col gap-1 ">
            <div className="flex flex-row text-center body-l-bold text-Grey-500">
              <p className="text-[#FB6362]">&#39;{searchWord}&#39;</p>
              <p>에 대한 검색 결과가 없습니다.</p>
            </div>
            <p className="body-s text-Grey-500">키워드를 정확하게 입력하셨는지 확인해보세요.</p>
          </div>
        </div>
      ) : (
        <>
          <SelectDropBox />

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
              <div className="w-full h-52">
                <p>데이터가 없습니다</p>
              </div>
            )}
          </div>

          {/* 페이지 셀렉트 */}
          {data && data.length > 0 && pageData ? (
            <PageSelect pageData={pageData} pageNumber={pageNumber} setPageNumber={setPageNumber} />
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};

export default RecruitList;
