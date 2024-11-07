# 🫂 ![logo](https://github.com/user-attachments/assets/7649a528-d89c-4256-ba1a-d77534cf5f61) 🫂

### 여러 사람들과 함께 소통하며 OTT를 즐기고 싶을땐?

![carousel (2)](https://github.com/user-attachments/assets/6e0bfa15-87d7-495d-aa18-a430babf22b4)
![carousel (3)](https://github.com/user-attachments/assets/b6af27c3-124c-4c20-9280-c632bc85a874)

<br/>

## 🫂 팀원 소개

|| 김경혜 | 홍연주 | 김태흔 | 신희범 | 이현주 |
| :----: | :----: | :----: | :----: | :----: | :----: |
| 역할 | 리더/FE | 부리더/FE | 팀원/FE | 팀원/FE | 팀원/DS |
| Github | <a href=https://github.com/nangnanang> @nangnanang </a> | <a href=https://github.com/play93> @play93 </a> | <a href=https://github.com/taeheun01> @taeheun01 </a> | <a href=https://github.com/HBeom00> @HBeom00 </a> | <a href=https://blog.naver.com/wezzzle> @wezzzle </a> |
| Blog | <a href=https://fpzmfks.tistory.com/> <img src="https://img.shields.io/badge/Tistory-000000?style=for-the-badge&logo=Tistory&logoColor=white&link=https://fpzmfks.tistory.com"> </a> | <a href=https://playhong.tistory.com/> <img src="https://img.shields.io/badge/Tistory-000000?style=for-the-badge&logo=Tistory&logoColor=white&link=https://playhong.tistory.com/"> </a> | <a href=https://earl-grey-tea.tistory.com/> <img src="https://img.shields.io/badge/Tistory-000000?style=for-the-badge&logo=Tistory&logoColor=white&link=https://earl-grey-tea.tistory.com/"> </a> | <a href=https://velog.io/@hbeom00/posts> <img src="https://img.shields.io/badge/Velog-20C997?style=for-the-badge&logo=Velog&logoColor=white&link=https://velog.io/@hbeom00/posts"> </a> | <a href=https://blog.naver.com/wezzzle> <img src="https://img.shields.io/badge/Velog-20C997?style=for-the-badge&logo=Velog&logoColor=white&link=https://blog.naver.com/wezzzle"> </a> |

#### 🕓 작업 기간 : 24.10.18 ~ 24.11.07

#### 📆 팀 노션 : [팀 노션 바로가기](https://www.notion.so/teamsparta/5-5-1222dc3ef51481a587efd07a9090088f)

#### 🔗 배포 링크 : [Watchat 바로가기](https://watchat.vercel.app/)

#### 🪶 깃허브 주소 : [깃허브 바로가기](https://github.com/HBeom00/watchat)

<br/>

## ⚔️ 파트 분배

<details>
<summary>김경혜</summary>
 
 - 상세페이지
  - 참가하기
  - 초대하기
  - 채팅창 들어가는 시간(시청시간 10분 전후) 조절
- 메인페이지
  - 검색, 정렬 및 필터와 페이지네이션
  - 헤더의 검색 필터 쿼리 스트링으로
  - 드롭다운 제작
    
</details>

<details>
<summary>홍연주</summary>
 
 - 마이페이지
  - 프로필 편집
  - 참여한 파티정보, 오너인 파티정보
  - 초대받은 파티정보
  - 팔로우 추천
  
</details>

<details>
<summary>김태흔</summary>
 
 - 모집 페이지
   - 검색창에서 영상 제목 검색 (api)
   - 검색된 영상 제목을 기반으로 영상정보 자동입력
   - 시청 날짜와 시청시간 선택
   - supabase 데이터 베이스에 기입한 정보와 영화 정보 insert
 - TMDB API 호출
   - api 호출 (Multi Search, 
, Movie Details
, Movie Provider
, Tv Details
, Tv Provider
, Tv Episode)
- 배너 
   - embla carusel 라이브러리 사용
- 푸터
- 헤더
  - ui 만 구성
</details>

<details>
<summary>신희범</summary>
 
 - 회원가입 / 소셜로그인
   - supabase auth를 활용한 로그인 기능
   - 소셜 로그인(카카오, 구글) 기능
 - 실시간 채팅
   - supabase realtime 이용
   - 팔로우 기능
   - 내보내기 기능
   - 파티 탈퇴 기능능
</details>

<details>
<summary>이현주</summary>
 
- UX 기획 & 와이어프레임
  - UI 디자인
  - 디자인시스템 구성
  - 로고 & 그래픽 제작
</details>


<br/>

## ⭐ 페이지 및 주요 기능 소개 ⭐

<details>
<summary>소셜 로그인/회원가입</summary>

<br />

- Supabase Auth Providers를 이용하여 소셜 로그인(카카오, 구글) 기능 구현
- react-hook-form를 사용하여 로그인/회원가입 폼 구성
- zod를 사용하여 실시간 유효성 검사 진행
- tanstack query를 활용하여 사용자 로그인 유무 관리
- 로그인 후 발급된 JWT토큰을 쿠키에 저장해 클라이언트측에서 토큰 기반으로 인증 상태를 확인해 인가된 리소스에 접근

---

![회원가입_수정본 (1)](https://github.com/user-attachments/assets/52200771-3680-4aae-80d0-e990ab29ad7a)

---

![스크린샷 2024-11-07 043849](https://github.com/user-attachments/assets/c1b327c7-d15c-40f2-9ae5-eb00cf6591ef)

</details>

<details>
<summary>개인정보 기입 페이지</summary>

<br />

- Supabase Storage를 이용한 이미지 파일 관리
- 플랫폼, 장르는 배열 형태로 상수화 하여 코드 간결성 및 유지 보수성 UP!!
- 마이페이지의 프로필 편집과 코드가 비슷해서 공용 컴포넌트로 따로 분리하여 코드 재사용

---

![개인정보기입](https://github.com/user-attachments/assets/b8879fda-4a43-49c2-b6ed-aea6347a5387)

</details>

<details>
<summary>메인페이지</summary>
 
<br />

**<supabase 메서드를 사용하여 페이지네이션과 정렬 필터 기능 구현>**

헤더의 필터는 useSearchParams로 query string으로 필터링과 검색
![Wachat-Chrome2024-11-0710-13-06-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/5cf30b72-ffd3-432c-8ec8-923619489fd7)

- supabase 메서드(order,textSearch, gte, lte, range)를 이용하여 페이지네이션과 정렬 필터를 결합하였다
  ![Wachat-Chrome2024-11-0710-38-24-ezgif com-crop (2)](https://github.com/user-attachments/assets/e581defe-b412-4d2b-9319-5120821dafaf)

- 디바운싱을 검색에 적용하여 데이터 요청횟수를 줄였다

</details>

<details>
<summary>마이페이지</summary>
  
<br />

 **프로필 편집 기능 구현**
- 프로필 이미지 변경시 이전 이미지 삭제 (불필요한 이미지가 계속 쌓이지 않도록 삭제)

**사용자가 참여한 파티정보, 오너인 파티정보 기능 구현**
- 최신순으로 4개씩만 보이도록 설정하고 그 이상은 더보기버튼을 통해 확인

**초대받은 파티정보 기능 구현**
- 캐러셀로 구성되어 4개 이상 쌓이면 좌우 버튼으로 이동하며 확인가능
- 다중선택기능으로 많은 초대를 한번에 거절할 수 있음
- 수락 시 파티 프로필을 작성하고 바로 해당 파티페이지로 이동

**팔로우 추천 불러오기**
- 캐러셀로 구성되어 6개 이상 쌓이면 좌우 버튼으로 이동하며 확인가능
- 종료된지 7일 이내의 파티의 파티원 목록을 불러옴
- 사용자 본인, 차단된 유저, 이미 팔로우된 유저 필터링
___
![screencapture-watchat-vercel-app-myPage-2024-11-07-13_14_54](https://github.com/user-attachments/assets/abfd74b9-2416-4c19-874b-10f4e81ecb55)
___
![스크린샷 2024-11-07 131315](https://github.com/user-attachments/assets/b025956c-9f67-427f-aecc-75073b3824a0)

</details>

<details>
<summary>파티 모집 페이지</summary>

<br />

**<TMDB API 를 사용하여 영상 이름을 기반으로 데이터 입력 및 가져오기>**

- TMDB API Multi Search 를 사용해서 영상제목 입력시 영상 정보 가져오기
- 검색 디바운싱
- 가져온 영상 정보를 자동 입력 (포스터,플랫폼,런타임,회차,시즌)
- (search로 가져온 영상\_id를 기반으로 Movie,Tv Detail api 사용 > 영상 정보 자동 입력)
- TV 프로그램 시즌, 회차, 런타임 자동입력 (Tv Episode api 사용 (params(영상\_id, season_id, episode_id)))
- 날짜, 시간 선택식으로 입력
- 기입한 정보와 영상 정보 insert

---

![파티-모집](https://github.com/user-attachments/assets/d59bf6b3-2184-4798-b926-1da054a1d6fe)

</details>

<details>
<summary>파티 상세 페이지</summary>

<br />

**<참가하기, 초대하기, 영상 정보 확인, 채팅하기 입장 컨트롤>**

- 참가하기 모달 창을 통해 파티 프로필을 작성하면 파티에 참가할 수 있습니다
- 초대하기 모달 창을 통해 내가 팔로우한 사람을 현재 파티에 초대할 수 있습니다.
- 시청 시간 10분 전후에 채팅하기 페이지로 이동할 수 있습니다.
- 현재 파티의 정보나 시청 영상 정보를 확인 할 수 있습니다.

---

![파티-상세](https://github.com/user-attachments/assets/f48a2408-d298-4a47-b62f-6b232154311a)

</details>

<details>
<summary>실시간 채팅 페이지</summary>

<br />

- Supabase Realtime을 활용하여 실시간 채팅 기능 구현
- 영상 시청 흐름을 파악할 수 있도록 재생바 기능 구현
- 공지 메세지 기능
- 팔로우 / 언팔로우 기능
- 추방하기 기능
- 파티 탈퇴 기능
___
![채팅_수정본](https://github.com/user-attachments/assets/833f6a69-3564-420c-a9d7-bdaf0ee44aaa)

</details>

<br/>

## 📂 프로젝트 구조

<details>
<summary>ERD 구조</summary>
 
![image](https://github.com/user-attachments/assets/e6aa6f64-2dec-48f7-bad7-8d821513d668)

</details>

<br/>

## 🛠️ 기술 스택

<div><img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=Figma&logoColor=white"></div>
<div>
<img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=Prettier&logoColor=white">
<img src="https://img.shields.io/badge/Eslint-4B32C3?style=for-the-badge&logo=Eslint&logoColor=white">
</div>
<div>
<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white">
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=for-the-badge&logo=Tailwind CSS&logoColor=white">
</div>
<div>
<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white">
<img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github&logoColor=white">
</div>
<div><img src="https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white"></div>
<div><img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=Vercel&logoColor=white"></div>

<br/>

## ⚔️ 트러블 슈팅

<h3><기능 방면></h3>
<details>
<summary>다른 채팅방과 채팅이 공유되는 이슈</summary>
 
<br>*원인*<br>
- 같은 채널명으로 실시간 메세지를 구독하도록 설정

<br>*해결과정*<br>
- 분기가 필요했기 때문에 각 채팅방 채널명에 고유 번호를 할당 하였고, 필터링을 해주었다

</details>

<details>
<summary> 참가하기 모달 창 오류</summary>

- 참가하기 모달 창은 총 3군데에서 사용되고 한 곳에서는 사용자가 함부로 닫을 수 없지만 나머지 2곳에서는 마음대로 닫을 수 있어야 한다. 때문에 openclose trigger를 컨트롤 할 수 있도록 했다. 이를 고려하여 구성한 모달 창이 button태그 중복 사용으로 인한 chlid props 오류가 떠서 refactoring을 하게 되었다.

  해결책들

  1.  chlid의 버튼 태그를 div 태그로(실패)
  2.  트리거를 따로 만들기(성공)
  3.  2개의 open 컨트롤 상태값 합치기(성공)

1. 첫번째 해결책은 트리거 버튼이 비동기 통신 로직을 가지고 있기 때문에 button 태그의 disabled 기능이 필요해서 기각되었다.
2. 두번째 해결책은 얼추 성공하였는데 모달창으로 버튼을 감싸지 말고 모달창과 버튼을 따로 두는 방법을 선택했다. chlid props를 내려주지 않기 때문에 button 태그를 중복으로 사용하는 문제는 해결했다. 또한 별도로 존재하는 모달창의 트리거 버튼을 안 보이게 했다.
3. 세번째 해결책으로 인해 최종적으로 모달 창 조정을 마쳤다. 기존에 open과 openControl이라는 2개의 상태값을 통해 모달 창을 컨트롤 했는데 이를 하나로 합치고 onOpenChange에서 이를 사용처에 따라 다르게 컨트롤 하도록 하였다.

```
<Dialog
        open={openControl}
        onOpenChange={() => {
          if (openControl && path.includes('/recruit')) {
            return setOpenControl(true);
          }
          return setOpenControl(!openControl);
        }}
      >
```

</details>

<details>
<summary>팔로우 추천에서 팔로우 했다가 팔로우 취소한 유저가 추천 목록에 뜨는 문제</summary>

<br>*해결과정*<br>
- 팔로우 취소한 유저를 필터링하기위해 ban_recommend 테이블을 별도로 만들어 한 번 팔로우 했다가 취소한 유저를 필터링 할 수 있도록 수정

</details>

<details>
<summary>각 카드마다 닫기버튼을 클릭하면 카드가 삭제되어야 했는데 단순 필터링만 해주다 보니 삭제를 할 수 없는 문제</summary>

<br>*해결과정*<br>
- 로컬스토리지를 이용해 삭제한 카드목록을 로컬스토리지에 담아 필터링하고, 로컬스토리지에 담긴 데이터는 7일후에 삭제되도록 계획
- 로컬스토리지를 이용해 관리하는 것은 로그인상태같은 정보를 담는데에 사용하는데 적합하고 구현하려는 필터링 내용은 사용자가 재로그인을 하던, 다른 브라우저에서 실행하던 동일해야하므로 적절하지 않다는 피드백
- 팔로우 취소한 유저를 필터링하기위해 만든 ban_recommend활용해 닫기버튼을 눌렀을 때에도 테이블에 담아 필터링할 수 있도록 수정

</details>

<h3><디자인 방면></h3>
➡️ 오류케이스에 대한 부분을 놓쳐 디자인 없이 들어간 경우가 있다
<div>해결 : 회의 할 때 더 꼼꼼하게 신경써서 기획하기!!</div>
➡️ 개발자 분들이 작업하면서 전달주시는데 다양한 경우를 고려한 기획이 필요할 것 같습니다
<div>해결 : 이것 또한 모두가 같이 더욱 신경써서 기획하기..!!</div>
➡️ 디자인 시스템 정리가 아직 미흡해서 기본화면과 호버 화면 등 전달에 대한 아쉬움이 있습니다


