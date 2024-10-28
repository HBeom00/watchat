import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createClient();

    // OAuth 로그인 후 세션 교환
    const {
      data: { session },
      error
    } = await supabase.auth.exchangeCodeForSession(code);

    if (session && !error) {
      // 세션 정보에서 사용자 ID 가져오기
      const userId = session.user.id;

      // user 테이블에서 해당 ID로 유저 확인
      const { data: user, error: userError } = await supabase.from('user').select('*').eq('user_id', userId);

      if (userError) {
        console.error('유저 확인 오류:', userError.message);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      }

      // 유저가 존재하면 메인 페이지로, 존재하지 않으면 firstLogin 페이지로 리다이렉트
      const redirectPath = user.length === 1 ? next : '/firstLogin';
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`);
      } else {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    } else {
      console.error('OAuth 인증 오류:', error?.message);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
