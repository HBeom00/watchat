import browserClient from '@/utils/supabase/client';

// warming 테이블에서 해당 user_id와 일치하는 모든 temperature 값을 합산
export const getWarming = async (userId: string | undefined): Promise<number> => {
  try {
    // warming 테이블에서 해당 user_id와 일치하는 warming_user_id의 temperature 합산
    const { data, error } = await browserClient.from('warming').select('temperature').eq('warming_user_id', userId);

    if (error) {
      console.error('warming 데이터 불러오기에 실패했습니다', error.message);
      return 0;
    }

    // temperature 값들의 합산 (기본값 50을 더함)
    const totalTemperature = data?.reduce((sum: number, row: { temperature: number }) => sum + row.temperature, 50);

    return totalTemperature ?? 50; // 데이터가 없다면 기본값 50 반환
  } catch (error) {
    console.error('에러 발생:', error);
    return 50; // 에러 발생 시 기본값 50 반환
  }
};
