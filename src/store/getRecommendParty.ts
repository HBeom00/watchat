import { startTimeString } from '@/utils/startTimeString';
import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { getViewStatus } from '@/utils/viewStatus';

// 파티 정보 타입
type PartyInfo = {
  duration_time: number;
  episode_number?: number | null;
  limited_member: number;
  media_type: string;
  owner_id: string;
  party_detail: string;
  party_id: string;
  party_name: string;
  situation: string;
  start_time: string;
  video_id: number;
  video_image: string;
  video_name: string;
  video_platform: string;
  watch_date: string;
  genres: string[]; // 장르(배열)
};

// 작성자 정보 타입
type OwnerProfile = {
  profile_image: string;
  nickname: string;
};

export interface RecommendParty extends PartyInfo {
  ownerProfile: OwnerProfile; // 파티 오너정보
  currentPartyPeople: number | undefined; // 참여 인원수
  startString: string;
}

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
export const getRecommendParty = async () => {
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
    console.log('유저데이터를 잘 가져옴', userData);
  }
  if (userError) {
    console.error('사용자의 장르정보를 가져오는데 실패했습니다. => ', userError.message);
    return [];
  }

  // 유저 장르를 배열로 변환
  const userGenre = userData.genre;
  console.log('유저 장르 정보:', userGenre);

  const { data: partyData, error: partyDataError } = await browserClient.from('party_info').select('*');

  if (partyData) {
    console.log('파티 정보도 불러왔음', partyData);
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

    console.log('파티 장르가 어떻게 찍히나 보자고', party.genres);
    console.log(typeof party.genres);

    // 장르를 문자열에서 배열로
    const genreFromStringToArray = JSON.parse(party.genres);

    const transformedGenres = transformGenre(genreFromStringToArray);
    console.log('변환된 장르:', party, transformedGenres); // 변환된 장르 확인

    // 유저 장르와 일치하는지 확인
    const isMatch = transformedGenres.some((partyGenre: string) => userGenre.includes(partyGenre));
    console.log('유저와 일치하는 장르 있는지:', isMatch); // 유저 장르 일치 여부 확인
    return isMatch;
  });

  console.log('장르만 필터링 한 목록을 가져오고', filterGenre);

  const filterActiveParty = filterGenre?.filter((party) => {
    const status = getViewStatus(party);
    return status === '시청중' || status === '모집중';
  });

  console.log('모집중이거나 시청중인거만 또 필터링을 해', filterActiveParty);

  const partyWithDetails = await Promise.all(
    filterActiveParty.map(async (party) => {
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
  console.log('추천파티 =>', partyWithDetails);
  return partyWithDetails;
};
