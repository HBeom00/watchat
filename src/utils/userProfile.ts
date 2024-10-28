// 이미지 업로드 onChange
// export const uploadImage = ({
//   imgRef,
//   setImgFile
// }: {
//   imgRef: React.RefObject<HTMLInputElement>;
//   setImgFile: React.Dispatch<React.SetStateAction<string>>;
// }) => {
//   const file = imgRef.current?.files?.[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onloadend = () => {
//       if (typeof reader.result === 'string') {
//         setImgFile(reader.result);
//       }
//     };
//   }
// };

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
