import browserClient from '@/utils/supabase/client';

// 이전 이미지 삭제 로직
export const deleteOldImages = async (userId: string, currentImageName: string) => {
  const { data: imgList, error: listError } = await browserClient.storage.from('profile_image').list(userId);

  if (listError) {
    console.error('이미지 목록 가져오기에 실패했습니다 => ', listError);
    return;
  }

  if (imgList && imgList.length > 0) {
    const deleteImg = imgList
      .filter((file) => file.name !== currentImageName.split('/').pop()) // 현재 이미지 이름에서 파일 이름만 비교
      .map((file) => `${userId}/${file.name}`);

    console.log('삭제할 이미지 목록 => ', deleteImg); // 삭제할 이미지 목록들

    if (deleteImg.length > 0) {
      const { data: deleteData, error: deleteError } = await browserClient.storage
        .from('profile_image')
        .remove(deleteImg);

      if (deleteError) {
        console.error('이미지 삭제 중 오류 발생 => ', deleteError);
      } else {
        console.log('정상적으로 삭제되었습니다.', deleteData);
      }
    }
  }
  console.log('현재 이미지 =>', currentImageName);
};
