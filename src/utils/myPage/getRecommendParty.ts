import { MyPagePartyInfo } from '@/types/myPagePartyInfo';
import { startTimeString } from '@/utils/startTimeString';
import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { getViewStatus } from '@/utils/viewStatus';

// 장르 변환
const transformGenre = (genres: string[]): string[] => {
  return genres.map((genre) => {
    if (genre.includes('Soap')) return '드라마';
    if (genre.includes('Reality') || genre.includes('Talk')) return '예능';
    if (genre.includes('Action & Adventure')) return '액션';
    if (genre.includes('Sci-Fi & Fantasy')) return 'SF';
    if (genre.includes('Kids')) return '가족';
    if (genre.includes('War & Politics')) return '전쟁';
    if (genre.includes('News')) return '다큐멘터리';
    return genre; // 나머지는 그대로 반환
  });
};

// 로그인한 사용자 정보 가져옴
export const getRecommendParty = async (): Promise<MyPagePartyInfo[]> => {
  const userId = await getLoginUserIdOnClient();

  if (!userId) {
    console.error('사용자 정보가 없습니다.');
    return [];
  }

  const { data: userData, error: userError } = await browserClient
    .from('user')
    .select('genre')
    .eq('user_id', userId)
    .single();

  if (userData) {
  }
  if (userError) {
    console.error('사용자의 장르정보를 가져오는데 실패했습니다. => ', userError.message);
    return [];
  }

  // 사용자가 참여중인 파티 가져오기
  const { data: alreadyJoinedParty, error: alreadyJoinedPartyError } = await browserClient
    .from('team_user_profile')
    .select('party_id')
    .eq('user_id', userId);

  if (alreadyJoinedPartyError) {
    console.error('사용자가 참여 중인 파티 ID를 가져오는데 실패했습니다. => ', alreadyJoinedPartyError.message);
    return [];
  }

  // 이미 참여중인 파티의 id를 배열로 변환
  const alreadyJoinedPartyId = alreadyJoinedParty?.map((item) => item.party_id) || [];

  // 유저 장르를 배열로 변환
  const userGenre = userData.genre;

  // 전체파티 가져오기
  const { data: partyData, error: partyDataError } = await browserClient
    .from('party_info')
    .select('*')
    .order('write_time', { ascending: false }); // 내림차순 정렬;

  if (partyData) {
  }
  if (partyDataError) {
    console.error('추천파티 정보를 가져오는데 실패했습니다. => ', partyDataError.message);
    return [];
  }
  // 영어로 된 장르명 수정해서 userGenre와 비교해 동일한 것만 가져옴
  const filterGenre = partyData?.filter((party) => {
    if (!party.genres || party.genres.length === 0) {
      return false;
    }

    // 장르를 문자열에서 배열로
    const genreFromStringToArray = JSON.parse(party.genres);
    // 장르 변환
    const transformedGenres = transformGenre(genreFromStringToArray);

    // 유저 장르와 일치하는지 확인
    const isMatch = transformedGenres.some((partyGenre: string) => userGenre.includes(partyGenre));
    return isMatch;
  });

  const filterActivePartyAndJoinedParty = filterGenre?.filter((party) => {
    const status = getViewStatus(party);
    const isNotJoined = !alreadyJoinedPartyId.includes(party.party_id);
    return status === '시청중' || (status === '모집중' && isNotJoined);
  });

  const partyWithDetails = await Promise.all(
    filterActivePartyAndJoinedParty.map(async (party) => {
      if (!party.owner_id) {
        console.error(`(참여한 파티) owner_id가 없습니다`);
        return { ...party, ownerProfile: { profile_img: '', nickname: '알 수 없음' }, currentParticipants: 0 };
      }

      // 작성자 정보 가져오기
      const { data: ownerData, error: ownerError } = await browserClient
        .from('team_user_profile')
        .select('*')
        .eq('user_id', party.owner_id)
        .eq('party_id', party.party_id)
        .single();

      if (ownerError) {
        console.error('(참여한 파티) 작성자 정보를 불러오는데 실패했습니다 => ', ownerError.message);
      }

      // 참여 인원수 가져오기
      const { data: partyNumberOfPeople, error: errorPartyNumberOfPeople } = await browserClient
        .from('team_user_profile')
        .select('*')
        .eq('party_id', party.party_id);

      if (errorPartyNumberOfPeople) {
        console.error('(참여한 파티) 참여 인원을 불러오는데 실패했습니다 => ', errorPartyNumberOfPeople.message);
      }

      const currentPartyPeople = partyNumberOfPeople?.length;

      // 날짜&시간 변환
      const startString = startTimeString(party.start_date_time);

      return {
        ...party,
        ownerProfile: ownerData || { profile_img: '', nickname: '알 수 없음' },
        currentPartyPeople,
        startString
      };
    })
  );
  return partyWithDetails;
};
