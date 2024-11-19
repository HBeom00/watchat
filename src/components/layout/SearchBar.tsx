'use client';
import useDebounce from '@/utils/hooks/useDebounce';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const SearchBar = () => {
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

  useEffect(() => {
    if (debounce !== '') {
      router.push('/search/' + encodeURIComponent(debounce) + '?' + searchParams.toString());
    }
    if (debounce === '' && pathname.startsWith('/search')) {
      router.push('/search/' + '?' + searchParams.toString());
    }
  }, [debounce]);

  return (
    <div
      className={`flex py-[4px] px-[16px] gap-[4px] justify-center items-center rounded-2xl bg-gray-50 relative
    mobile:hidden
    mobile:top-[108px] mobile:w-[303px]`}
    >
      <Image src={'/search_icon.svg'} width={20} height={20} alt="검색아이콘" className="flex-shrink-0" />
      <input
        type="text"
        value={text}
        className="flex-[1_0_0] body-s text-Grey-900 bg-transparent outline-none"
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
          className="flex-shrink-0 absolute right-[16px]"
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default SearchBar;
