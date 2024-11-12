import useDebounce from '@/utils/hooks/useDebounce';
import Image from 'next/image';
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
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (debounce !== '') {
      router.push('/?' + createQueryString('search', encodeURIComponent(debounce)));
    }
    if (debounce === '' && searchParams.get('search') !== '' && searchParams.get('search') !== null) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('search');
      router.push('/?' + params);
    }
  }, [debounce]);

  return (
    <div className="flex py-[4px] px-[16px] gap-[4px] justify-center items-center rounded-2xl bg-gray-50">
      <Image src={'/search_icon.svg'} width={20} height={20} alt="검색아이콘" className="flex-shrink-0" />
      <input
        type="text"
        className="flex-[1_0_0] body-s text-Grey-900 bg-transparent outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="콘텐츠를 검색해보세요"
      />
      {text !== '' ? (
        <Image
          src={'/deleteX.svg'}
          width={20}
          height={20}
          onClick={() => setText('')}
          alt="검색어 삭제"
          className="flex-shrink-0"
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default SearchBar;
