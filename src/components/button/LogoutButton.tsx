'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import browserClient from '@/utils/supabase/client';

const LogoutButton = () => {
  const route = useRouter();
  const queryClient = useQueryClient();

  // 로그아웃 하기
  const { mutate: logoutBtn } = useMutation({
    mutationFn: async () => await browserClient.auth.signOut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userId'] });
      route.push('/login');
    }
  });

  return (
    <button className="selectDropBoxLast" onClick={() => logoutBtn()}>
      로그아웃
    </button>
  );
};

export default LogoutButton;
