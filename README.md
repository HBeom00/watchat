# 🫂 ![logo](https://github.com/user-attachments/assets/7649a528-d89c-4256-ba1a-d77534cf5f61) 🫂

### 여러 사람들과 함께 소통하며 OTT를 즐기고 싶을땐?

![carousel (2)](https://github.com/user-attachments/assets/6e0bfa15-87d7-495d-aa18-a430babf22b4)
![carousel (3)](https://github.com/user-attachments/assets/b6af27c3-124c-4c20-9280-c632bc85a874)

<br/>

## 🫂 팀원 소개

|        |                                                                                        김경혜                                                                                        |                                                                                         홍연주                                                                                          |                                                                                              김태흔                                                                                               |                                                                                         신희범                                                                                          |                                                                                        이현주                                                                                         |
| :----: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  역할  |                                                                                       리더/FE                                                                                        |                                                                                        부리더/FE                                                                                        |                                                                                              팀원/FE                                                                                              |                                                                                         팀원/FE                                                                                         |                                                                                        팀원/DS                                                                                        |
| Github |                                                               <a href=https://github.com/nangnanang> @nangnanang </a>                                                                |                                                                     <a href=https://github.com/play93> @play93 </a>                                                                     |                                                                       <a href=https://github.com/taeheun01> @taeheun01 </a>                                                                       |                                                                    <a href=https://github.com/HBeom00> @HBeom00 </a>                                                                    |                                                                 <a href=https://blog.naver.com/wezzzle> @wezzzle </a>                                                                 |
|  Blog  | <a href=https://fpzmfks.tistory.com/> <img src="https://img.shields.io/badge/Tistory-000000?style=for-the-badge&logo=Tistory&logoColor=white&link=https://fpzmfks.tistory.com"> </a> | <a href=https://playhong.tistory.com/> <img src="https://img.shields.io/badge/Tistory-000000?style=for-the-badge&logo=Tistory&logoColor=white&link=https://playhong.tistory.com/"> </a> | <a href=https://earl-grey-tea.tistory.com/> <img src="https://img.shields.io/badge/Tistory-000000?style=for-the-badge&logo=Tistory&logoColor=white&link=https://earl-grey-tea.tistory.com/"> </a> | <a href=https://velog.io/@hbeom00/posts> <img src="https://img.shields.io/badge/Velog-20C997?style=for-the-badge&logo=Velog&logoColor=white&link=https://velog.io/@hbeom00/posts"> </a> | <a href=https://blog.naver.com/wezzzle> <img src="https://img.shields.io/badge/Velog-20C997?style=for-the-badge&logo=Velog&logoColor=white&link=https://blog.naver.com/wezzzle"> </a> |

#### 🕓 작업 기간 : 24.10.18 ~ 24.11.07

#### 📆 팀 노션 : [팀 노션 바로가기](https://www.notion.so/teamsparta/5-5-1222dc3ef51481a587efd07a9090088f)

#### 🔗 배포 링크 : [Watchat 바로가기](https://watchat.vercel.app/)

#### 🪶 깃허브 주소 : [깃허 바로가기](https://github.com/HBeom00/watchat)

<br/>

## ⚔️ 파트 분배

<details>
<summary>김경혜</summary>
 
 - 예시
   - 예시
</details>

<details>
<summary>홍연주</summary>
 
 - 마이페이지
  - 프로필 편집 
  - 팔로우 목록 불러오기, 다른 유저 팔로우, 팔로우 취소
  - 사용자가 참여한 파티 정보, 오너인 파티 정보
  - 초대받은 파티 정보
  - 팔로우 추천 불러오기

</details>

<details>
<summary>김태흔</summary>
 
 - 예시
   - 예시
</details>

<details>
<summary>신희범</summary>
 
 - 로그인/로그아웃
   - supabase auth를 활용한 로그인 기능 구현
   - 소셜 로그인(카카오, 구글) 기능 구현
 - 실시간 채팅
   - supabase realtime 이용
</details>

<details>
<summary>이현주</summary>
 
 - 예시
   - 예시
</details>

<br/>

## ⭐ 페이지 및 주요 기능 소개 ⭐

<details>
<summary>소셜 로그인/회원가입</summary>

<br />

**<supabase auth를 사용해 이메일과 OAuth 기반의 소셜 로그인 기능 구현>**

- 소셜 로그인(카카오, 구글) 기능 구현
- 로그인 후 발급된 JWT토큰을 쿠키에 저장해 클라이언트측에서 토큰 기반으로 인증 상태를 확인해 인가된 리소스에 접근 ⭕
- 로그인, 회원가입 폼을 react-hook-form 라이브러리를 사용해 구성 ⭕
- register를 이용해 비제어 컴포넌트로 폼을 관리해 실시간 유효성 검사도 진행 ⭕

---

![회원가입_수정본 (1)](https://github.com/user-attachments/assets/52200771-3680-4aae-80d0-e990ab29ad7a)

---

![스크린샷 2024-11-07 043849](https://github.com/user-attachments/assets/c1b327c7-d15c-40f2-9ae5-eb00cf6591ef)

</details>

<details>
<summary>개인정보 기입 페이지</summary>

<br />

**<supabase auth를 사용해 이메일과 OAuth 기반의 소셜 로그인 기능 구현>**

- 소셜 로그인(카카오, 구글) 기능 구현
- 로그인 후 발급된 JWT토큰을 쿠키에 저장해 클라이언트측에서 토큰 기반으로 인증 상태를 확인해 인가된 리소스에 접근 ⭕
- 로그인, 회원가입 폼을 react-hook-form 라이브러리를 사용해 구성 ⭕
- register를 이용해 비제어 컴포넌트로 폼을 관리해 실시간 유효성 검사도 진행 ⭕

---

![개인정보기입](https://github.com/user-attachments/assets/b8879fda-4a43-49c2-b6ed-aea6347a5387)

</details>

<details>
<summary>메인페이지</summary>
 
<br />

**<supabase auth를 사용해 이메일과 OAuth 기반의 소셜 로그인 기능 구현>**

- 소셜 로그인(카카오, 구글) 기능 구현
- 로그인 후 발급된 JWT토큰을 쿠키에 저장해 클라이언트측에서 토큰 기반으로 인증 상태를 확인해 인가된 리소스에 접근 ⭕
- 로그인, 회원가입 폼을 react-hook-form 라이브러리를 사용해 구성 ⭕
- register를 이용해 비제어 컴포넌트로 폼을 관리해 실시간 유효성 검사도 진행 ⭕

---

</details>

<details>
<summary>마이페이지</summary>
  
<br />

**<프로필 편집 기능 구현>**

- 프로필 이미지 변경시 이전 이미지 삭제 (불필요한 이미지가 계속 쌓이지 않도록 삭제)

**<사용자가 참여한 파티정보, 오너인 파티정보 기능 구현>**

- 최신순으로 4개씩만 보이도록 설정하고 그 이상은 더보기버튼을 통해 확인

**<초대받은 파티정보 기능 구현>**

- 캐러셀로 구성되어 4개 이상 쌓이면 좌우 버튼으로 이동하며 확인가능
- 다중선택기능으로 많은 초대를 한번에 거절할 수 있음
- 수락 시 파티 프로필을 작성하고 바로 해당 파티페이지로 이동

**<팔로우 추천 불러오기>**

- 캐러셀로 구성되어 6개 이상 쌓이면 좌우 버튼으로 이동하며 확인가능
- 종료된지 7일 이내의 파티의 파티원 목록을 불러옴
- 사용자 본인, 차단된 유저, 이미 팔로우된 유저 필터링

</details>

<details>
<summary>파티 모집 페이지</summary>

<br />

**<supabase auth를 사용해 이메일과 OAuth 기반의 소셜 로그인 기능 구현>**

- 소셜 로그인(카카오, 구글) 기능 구현
- 로그인 후 발급된 JWT토큰을 쿠키에 저장해 클라이언트측에서 토큰 기반으로 인증 상태를 확인해 인가된 리소스에 접근 ⭕
- 로그인, 회원가입 폼을 react-hook-form 라이브러리를 사용해 구성 ⭕
- register를 이용해 비제어 컴포넌트로 폼을 관리해 실시간 유효성 검사도 진행 ⭕

---

![파티-모집](https://github.com/user-attachments/assets/d59bf6b3-2184-4798-b926-1da054a1d6fe)

</details>

<details>
<summary>파티 상세 페이지</summary>

<br />

**<supabase auth를 사용해 이메일과 OAuth 기반의 소셜 로그인 기능 구현>**

- 소셜 로그인(카카오, 구글) 기능 구현
- 로그인 후 발급된 JWT토큰을 쿠키에 저장해 클라이언트측에서 토큰 기반으로 인증 상태를 확인해 인가된 리소스에 접근 ⭕
- 로그인, 회원가입 폼을 react-hook-form 라이브러리를 사용해 구성 ⭕
- register를 이용해 비제어 컴포넌트로 폼을 관리해 실시간 유효성 검사도 진행 ⭕

---

![파티-상세](https://github.com/user-attachments/assets/f48a2408-d298-4a47-b62f-6b232154311a)

</details>

<details>
<summary>실시간 채팅 페이지</summary>

<br />

**<supabase auth를 사용해 이메일과 OAuth 기반의 소셜 로그인 기능 구현>**

- 소셜 로그인(카카오, 구글) 기능 구현
- 로그인 후 발급된 JWT토큰을 쿠키에 저장해 클라이언트측에서 토큰 기반으로 인증 상태를 확인해 인가된 리소스에 접근 ⭕
- 로그인, 회원가입 폼을 react-hook-form 라이브러리를 사용해 구성 ⭕
- register를 이용해 비제어 컴포넌트로 폼을 관리해 실시간 유효성 검사도 진행 ⭕

</details>

<br/>

## 📂 프로젝트 구조 <-ERD 및 아키텍쳐 들어갈 예정

<details>
<summary>폴더 구조</summary>

```
📦src
 ┣ 📂app
 ┃ ┣ 📂(auth)
 ┃ ┃ ┣ 📂login
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂reset-password
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂signup
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂update-password
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📜auth-layout.tsx
 ┃ ┃ ┗ 📜loading.tsx
 ┃ ┣ 📂(root)
 ┃ ┃ ┣ 📂(protected)
 ┃ ┃ ┃ ┗ 📂mypage
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┗ 📂detail
 ┃ ┃ ┃ ┗ 📂[category]
 ┃ ┃ ┃ ┃ ┗ 📂[id]
 ┃ ┃ ┃ ┃ ┃ ┣ 📜AllComments.tsx
 ┃ ┃ ┃ ┃ ┃ ┣ 📜Comment.tsx
 ┃ ┃ ┃ ┃ ┃ ┣ 📜Comments.tsx
 ┃ ┃ ┃ ┃ ┃ ┣ 📜MyComments.tsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📂login
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┣ 📂logout
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┣ 📂signup
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┗ 📜auth.ts
 ┃ ┣ 📂auth
 ┃ ┃ ┗ 📂callback
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┣ 📂fonts
 ┃ ┃ ┣ 📜GeistMonoVF.woff
 ┃ ┃ ┣ 📜GeistVF.woff
 ┃ ┃ ┗ 📜PretendardVariable.woff2
 ┃ ┣ 📜favicon.ico
 ┃ ┣ 📜globals.css
 ┃ ┣ 📜layout.tsx
 ┃ ┣ 📜page.tsx
 ┃ ┗ 📜providers.tsx
 ┣ 📂components
 ┃ ┣ 📂common
 ┃ ┃ ┣ 📂Button
 ┃ ┃ ┃ ┣ 📜GoogleButton.tsx
 ┃ ┃ ┃ ┣ 📜KakaoButton.tsx
 ┃ ┃ ┃ ┗ 📜LogoutButton.tsx
 ┃ ┃ ┣ 📂Form
 ┃ ┃ ┃ ┣ 📜LoginForm.tsx
 ┃ ┃ ┃ ┣ 📜ResetPasswordForm.tsx
 ┃ ┃ ┃ ┣ 📜SignUpForm.tsx
 ┃ ┃ ┃ ┗ 📜UpdatePasswordForm.tsx
 ┃ ┃ ┗ 📂InputFeild
 ┃ ┃ ┃ ┗ 📜InputField.tsx
 ┃ ┣ 📂layout
 ┃ ┃ ┣ 📜Footer.tsx
 ┃ ┃ ┗ 📜Header.tsx
 ┃ ┣ 📂likes
 ┃ ┃ ┗ 📜LikeButton.tsx
 ┃ ┣ 📂mainPage
 ┃ ┃ ┣ 📜CategoryNewsCard.tsx
 ┃ ┃ ┣ 📜CategoryNewsList.tsx
 ┃ ┃ ┣ 📜TopNewsCard.tsx
 ┃ ┃ ┗ 📜TopNewsList.tsx
 ┃ ┗ 📂mypage
 ┃ ┃ ┣ 📜Card.tsx
 ┃ ┃ ┣ 📜Comment.tsx
 ┃ ┃ ┣ 📜Likes.tsx
 ┃ ┃ ┣ 📜Modal.tsx
 ┃ ┃ ┗ 📜Profile.tsx
 ┣ 📂providers
 ┃ ┗ 📜userStoreProvider.tsx
 ┣ 📂public
 ┃ ┣ 📂images
 ┃ ┃ ┣ 📜default_img.jpg
 ┃ ┃ ┗ 📜default_profile.jpeg
 ┃ ┣ 📜google.png
 ┃ ┣ 📜kakao.png
 ┃ ┗ 📜news_image.jpg
 ┣ 📂serverActions
 ┃ ┣ 📜newsApi.ts
 ┃ ┗ 📜profileActions.ts
 ┣ 📂store
 ┃ ┗ 📜user-store.ts
 ┣ 📂types
 ┃ ┣ 📜comment.ts
 ┃ ┣ 📜mypageTypes.ts
 ┃ ┗ 📜newsInfo.ts
 ┣ 📂utils
 ┃ ┣ 📂category
 ┃ ┃ ┗ 📜categoryArr.ts
 ┃ ┣ 📂supabase
 ┃ ┃ ┣ 📜client.ts
 ┃ ┃ ┣ 📜middleware.ts
 ┃ ┃ ┣ 📜profileService.ts
 ┃ ┃ ┗ 📜server.ts
 ┃ ┗ 📜teamInfo.ts
 ┗ 📜middleware.ts
```

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

**홍연주**<br>

<details>
<summary>팔로우 추천에서 팔로우 했다가 팔로우 취소한 유저가 추천 목록에 뜨는 문제</summary>

<br>_해결과정_<br>

- 팔로우 취소한 유저를 필터링하기위해 ban_recommend 테이블을 별도로 만들어 한 번 팔로우 했다가 취소한 유저를 필터링 할 수 있도록 수정

</details>

<details>
<summary>각 카드마다 닫기버튼을 클릭하면 카드가 삭제되어야 했는데 단순 필터링만 해주다 보니 삭제를 할 수 없는 문제</summary>

<br>_해결과정_<br>

- 로컬스토리지를 이용해 삭제한 카드목록을 로컬스토리지에 담아 필터링하고, 로컬스토리지에 담긴 데이터는 7일후에 삭제되도록 계획
- 로컬스토리지를 이용해 관리하는 것은 로그인상태같은 정보를 담는데에 사용하는데 적합하고 구현하려는 필터링 내용은 사용자가 재로그인을 하던, 다른 브라우저에서 실행하던 동일해야하므로 적절하지 않다는 피드백
- 팔로우 취소한 유저를 필터링하기위해 만든 ban_recommend활용해 닫기버튼을 눌렀을 때에도 테이블에 담아 필터링할 수 있도록 수정

</details>
