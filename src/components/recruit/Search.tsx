// SearchComponent.tsx
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMultiSearch } from '@/serverActions/TMDB';
import { SearchProps, SearchResponse } from '@/types/Search';

export const SearchComponent: React.FC<SearchProps> = ({ videoName, setVideoName, handleSearchResultClick }) => {
  // 검색 결과 상태
  const [showResults, setShowResults] = useState(false);
  // 최종 검색어
  const [debouncedVideoName, setDebouncedVideoName] = useState(videoName);

  // Multisearch api
  const { data: searchResults } = useQuery<SearchResponse>({
    queryKey: ['searchVideo', debouncedVideoName],
    queryFn: () => fetchMultiSearch(debouncedVideoName),
    enabled: !!debouncedVideoName
  });

  const handleInputChange = (value: string) => {
    setVideoName(value);
    setShowResults(!!value);
  };
  // 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedVideoName(videoName);
    }, 300);

    // 타이머 초기화
    return () => clearTimeout(timer);
  }, [videoName]);

  return (
    <div className="relative w-[519px] mt-[16px]">
      <input
        type="text"
        placeholder="선택하세요."
        value={videoName}
        onChange={(e) => handleInputChange(e.target.value)}
        className="w-full h-[48px] px-4 border border-Grey-300 rounded-md text-[15px] text-gray-800 focus:border-primary-500 focus:outline-none"
      />
      {showResults && searchResults?.results?.length ? (
        <ul className="custom-scrollbar w-full h-[190px] overflow-y-auto border border-Grey-300 border-t-0 rounded-b-md bg-white z-10">
          {searchResults.results.map((result) => (
            <li
              key={result.id}
              onClick={() => {
                handleSearchResultClick(result);
                setShowResults(false);
              }}
              className="px-4 py-3 text-[15px] text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg"
            >
              {result.title || result.name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default SearchComponent;
