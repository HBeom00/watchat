// 파티명 13자 제한
export const cutPartyName = (partyName: string) => (partyName.length > 13 ? partyName.slice(0, 13) + '...' : partyName);

// 유저 이름 7자 제한
export const cutUserName = (userName: string) => (userName.length > 7 ? userName.slice(0, 7) + '...' : userName);

// 영상제목 10자 제한
export const cutVideoName = (userName: string) => (userName.length > 10 ? userName.slice(0, 10) + '...' : userName);
