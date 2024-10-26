'use client';

import Image from 'next/image';
import { useState } from 'react';

const FirstLoginForm = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);

  return (
    <form>
      <Image
        src={'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/avatar.png'}
        alt="프로필 이미지"
        width={100}
        height={100}
      />
      <input id="selectImg" type="file" />

      <p>
        닉네임<span>*</span>
      </p>
      <input type="text" />

      <p>플랫폼</p>

      <p>장르</p>

      <button>완료</button>
    </form>
  );
};

export default FirstLoginForm;
