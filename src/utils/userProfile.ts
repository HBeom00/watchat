import { useRef, useState } from 'react';

// 이미지 업로드 -> onChange
export const useImageUpload = () => {
  const [imgFile, setImgFile] = useState<string>('');
  const imgRef = useRef<HTMLInputElement>(null);

  const uploadImage = () => {
    const file = imgRef.current?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImgFile(reader.result);
        }
      };
    }
  };

  return { imgFile, imgRef, uploadImage };
};

// 플랫폼 클릭 시
export const onClickPlatform = ({
  platform,
  setPlatforms
}: {
  platform: string;
  setPlatforms: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  setPlatforms((prev) => (prev.includes(platform) ? prev.filter((el) => el !== platform) : [...prev, platform]));
};

// 장르 클릭 시
export const onClickGenre = ({
  genre,
  setGenres
}: {
  genre: string;
  setGenres: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  setGenres((prev) => (prev.includes(genre) ? prev.filter((el) => el !== genre) : [...prev, genre]));
};

// 이미지 파일 -> storage에 저장
// export const storageUpload = async({profile_image_name, file}: {profile_image_name: string, file: File}) => {
//   await browserClient.storage.from('profile_image').upload(profile_image_name, file, {
//     cacheControl: 'no-store',
//     upsert: true
//   });
// }
