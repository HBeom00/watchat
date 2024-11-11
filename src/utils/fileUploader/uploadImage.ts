import { Dispatch, RefObject, SetStateAction } from 'react';

// 이미지 업로드 onChange
const uploadImage = (imgRef: RefObject<HTMLInputElement>, setProfile_image: Dispatch<SetStateAction<string>>) => {
  const file = imgRef.current?.files?.[0]; // 선택한 파일을 file에 저장
  if (file) {
    // 파일이 있다면
    const reader = new FileReader(); // 1. 사용할 FileReader를 reader에 선언
    reader.readAsDataURL(file); // 2. .readAsDataURL메서드를 사용해 파일을 데이터 URL형식으로 변환
    reader.onloadend = () => {
      // 3. FileReader가 파일을 다 읽고 난 뒤 실행되는 함수
      if (typeof reader.result === 'string') {
        setProfile_image(reader.result); // 4. reader.result는 3에서 읽은 데이터를 담고있음. 이걸 ImgFile에 담아줌
      }
    };
  }
};

export default uploadImage;
