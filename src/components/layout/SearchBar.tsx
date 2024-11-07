import useDebounce from '@/utils/hooks/useDebounce';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const SearchBar = () => {
  const [text, setText] = useState<string>('');
  const debounce = useDebounce(text, 1000);
  const searchParams = useSearchParams();
  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, encodeURIComponent(value));

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (debounce !== null) {
      router.push('/?' + createQueryString('search', debounce));
    }
  }, [debounce]);

  return (
    <div className="flex py-1 px-4 items-center gap-2 rounded-2xl bg-gray-50 w-[250px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.4987 3.43229C5.73727 3.43229 3.4987 5.67087 3.4987 8.43229C3.4987 11.1937 5.73727 13.4323 8.4987 13.4323C11.2601 13.4323 13.4987 11.1937 13.4987 8.43229C13.4987 5.67087 11.2601 3.43229 8.4987 3.43229ZM1.83203 8.43229C1.83203 4.75039 4.8168 1.76562 8.4987 1.76562C12.1806 1.76562 15.1654 4.75039 15.1654 8.43229C15.1654 10.0071 14.6194 11.4543 13.7063 12.595L17.9235 16.8122L16.745 17.9907L12.5111 13.7568C11.3948 14.5993 10.0051 15.099 8.4987 15.099C4.8168 15.099 1.83203 12.1142 1.83203 8.43229Z"
          fill="#757575"
        />
      </svg>
      <input
        type="text"
        className="w-[190px] flex-shrink-0 font-normal text-[14px] leading-[22px] text-static-black bg-transparent outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="보고싶은 콘텐츠를 검색해보세요"
      />
    </div>
  );
};

export default SearchBar;
