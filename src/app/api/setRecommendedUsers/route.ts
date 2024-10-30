import type { NextApiRequest, NextApiResponse } from 'next';

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { recommendedUsers } = req.body;

    // 쿠키에 추천 사용자 목록 저장
    res.setHeader(
      'Set-Cookie',
      `recommendedUsers=${JSON.stringify(recommendedUsers)}; HttpOnly; Max-Age=${60 * 60 * 24 * 7}; Path=/;`
    );

    // 성공 응답 반환
    res.status(200).json({ success: true });
  } else {
    // 다른 HTTP 메서드 처리
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
