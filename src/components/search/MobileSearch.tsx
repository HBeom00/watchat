'use client';
import { fetchMultiSearch } from '@/serverActions/TMDB';
import { SearchResponse } from '@/types/search';
import useDebounce from '@/utils/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const MobileSearch = () => {
  const [showResults, setShowResults] = useState(false);

  const [text, setText] = useState<string>('');
  const debounce = useDebounce(text, 1000);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathname.startsWith('/search')) {
      setText('');
    }
  }, [pathname]);

  // Multisearch api
  const { data: searchResults } = useQuery<SearchResponse>({
    queryKey: ['searchVideo', debounce],
    queryFn: () => fetchMultiSearch(debounce),
    enabled: !!debounce
  });

  return (
    <div
      className={`hidden flex-col w-full gap-[16px]
    mobile:flex`}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push('/search/' + encodeURIComponent(text) + '?' + searchParams.toString());
        }}
        className={`flex py-[4px] px-[16px] gap-[4px] flex-row justify-center items-center rounded-2xl bg-gray-50 relative`}
      >
        <Image src={'/search_icon.svg'} width={20} height={20} alt="검색아이콘" className="flex-shrink-0" />
        <input
          type="text"
          value={text}
          className="flex-[1_0_0] body-s text-Grey-900 bg-transparent outline-none"
          onChange={(e) => {
            setText(e.target.value);
            setShowResults(!!e.target.value);
          }}
          autoFocus
          placeholder="콘텐츠를 검색해보세요"
        />
        {text !== '' ? (
          <Image
            src={'/deleteX.svg'}
            width={20}
            height={20}
            onClick={() => setText('')}
            alt="검색어 삭제"
            className="flex-shrink-0 absolute right-[16px]"
          />
        ) : (
          <></>
        )}
      </form>
      {showResults && searchResults?.results?.length ? (
        <ul className="w-full overflow-y-auto bg-static-white z-10">
          {searchResults.results.map((result) => (
            <li
              key={result.id}
              onClick={() => {
                router.push(
                  '/search/' +
                    encodeURIComponent(result.title || result.name ? result.title || result.name || text : text) +
                    '?' +
                    searchParams.toString()
                );
                setShowResults(false);
              }}
              className="px-4 py-3 text-[15px] text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg"
            >
              {result.title || result.name}
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col justify-center items-center gap-2 pt-12 pb-[100px] h-[510px]">
          <Image src={'/searchCat.svg'} width={116} height={100} alt="검색 결과가 없습니다" />
          <div className="flex flex-col gap-1 ">
            <div className="flex flex-row text-center body-l-bold text-Grey-500">
              <p>검색어를 입력해주세요</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileSearch;
