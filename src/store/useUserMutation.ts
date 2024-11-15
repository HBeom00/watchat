// useUserMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile, registerUser } from './getUserProfile';
import { User } from './getUserProfile';

type MutatedUser = {
  user: User | null;
  file: File | null;
  profile_image_name: string;
  nickname: string;
  pathname: string;
  platforms: string[];
  genres: string[];
  deleteOldImages: (userId: string, currentImageName: string) => Promise<void>;
};

const useUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, MutatedUser>({
    mutationFn: async (MutatedUser: MutatedUser) => {
      const { user, file, profile_image_name, nickname, pathname, platforms, genres, deleteOldImages } = MutatedUser;

      if (pathname === '/my-page/edit' && user) {
        await updateUserProfile(user, file, profile_image_name, nickname, platforms, genres, deleteOldImages);
      } else if (user) {
        await registerUser(user, file, profile_image_name, nickname, platforms, genres);
      }
    },
    onSuccess: (data, MutatedUser) => {
      const { pathname } = MutatedUser;

      if (pathname === '/my-page/edit') {
        alert('수정이 완료되었습니다.');
      } else {
        alert('등록되었습니다.');
      }

      // 사용자 데이터를 무효화하여 쿼리를 갱신합니다.
      if (MutatedUser.user) {
        queryClient.invalidateQueries({ queryKey: ['user', MutatedUser.user.id] });
      }
    },
    onError: (error: Error) => {
      // 오류 타입 지정
      alert('처리 중 오류가 발생했습니다: ' + error.message);
    }
  });
};

export default useUserMutation;
