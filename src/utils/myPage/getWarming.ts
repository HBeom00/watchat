import browserClient from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

// 식빵온도 가져오기
export const getWarming = async (userId: string | undefined): Promise<number> => {
  if (!userId) {
    console.warn('유효하지 않은 userId:', userId);
    return 50;
  }

  // warming 테이블에서 해당 user_id와 일치하는 warming_user_id의 temperature 합산
  const { data, error } = await browserClient.from('warming').select('temperature').eq('warming_user_id', userId);

  if (error) {
    console.error('warming 데이터 불러오기에 실패했습니다', error.message);
    return 0;
  }

  // temperature 값들의 합산 (기본값 50을 더함)
  const totalTemperature = data?.reduce((sum: number, row: { temperature: number }) => sum + row.temperature, 50);

  if (error) {
    console.error('에러 발생:', error);
    return 50; // 에러 발생 시 기본값 50 반환
  }
  return totalTemperature ?? 50; // 데이터가 없다면 기본값 50 반환
};

// 코멘트 가져오기
export const getComments = async (userId: string | undefined) => {
  if (!userId) {
    console.warn('유효하지 않은 userId:', userId);
    return [];
  }

  const { data: commentData, error: commentError } = await browserClient
    .from('warming')
    .select('comment')
    .eq('warming_user_id', userId);

  if (commentError) {
    console.error('comment 데이터 불러오기에 실패했습니다', commentError.message);
    return [];
  }

  const commentsList = [
    '매너있게 관람했어요.',
    '시간 약속을 잘 지켜요.',
    '다음에 같이 시청하고 싶어요.',
    '시청 매너가 좋아요.',
    '즐겁게 관람했어요.',
    '시청 매너가 아쉬웠어요.',
    '시간 약속을 지키지 않아요.',
    '다음에 함께하고 싶지 않아요.',
    '참여하지 않았어요.',
    '중간에 나가서 돌아오지 않았어요.'
  ];

  const commentCounts: { comment: string; commentCount: number }[] = commentsList.map((comment) => ({
    comment,
    commentCount: 0
  }));

  // 각 코멘트의 갯수구하기
  commentData?.forEach((entry: { comment: string[] }) => {
    entry.comment.forEach((singleComment) => {
      const findSameComments = commentCounts.find((c) => c.comment === singleComment);

      if (findSameComments) {
        findSameComments.commentCount++;
      }
    });
  });

  return commentCounts.filter((c) => c.commentCount > 0);
};

export const useTotalTemperature = (userId: string) => {
  return useQuery({
    queryKey: ['warming', userId],
    queryFn: () => getWarming(userId)
  });
};

export const useTotalComments = (userId: string) => {
  return useQuery({
    queryKey: ['comments', userId],
    queryFn: () => getComments(userId)
  });
};
