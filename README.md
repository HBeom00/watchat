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

#### 🪶 깃허브 주소 : [깃허브 바로가기](https://github.com/HBeom00/watchat)

<br/>

## ⚔️ 파트 분배

<details>
<summary>김경혜</summary>
 
 - 예시
   - 예시
</details>

<details>
<summary>홍연주</summary>
 
 - 예시
   - 예시
</details>

<details>
<summary>김태흔</summary>
 
 - 예시
   - 예시
</details>

<details>
<summary>신희범</summary>
 
 - 회원가입 / 소셜로그인
   - supabase auth를 활용한 로그인 기능 구현
   - 소셜 로그인(카카오, 구글) 기능 구현
 - 실시간 채팅
   - supabase realtime 이용
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

**<supabase auth를 사용해 이메일과 OAuth 기반의 소셜 로그인 기능 구현>**

- 소셜 로그인(카카오, 구글) 기능 구현
- 로그인 후 발급된 JWT토큰을 쿠키에 저장해 클라이언트측에서 토큰 기반으로 인증 상태를 확인해 인가된 리소스에 접근 ⭕
- 로그인, 회원가입 폼을 react-hook-form 라이브러리를 사용해 구성 ⭕
- register를 이용해 비제어 컴포넌트로 폼을 관리해 실시간 유효성 검사도 진행 ⭕

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

- Supabase Realtime을 활용하여 실시간 채팅 기능 구현
- 영상 시청 흐름을 파악할 수 있도록 재생바 기능 구현
- 공지 메세지 기능
- 팔로우 / 언팔로우 기능
- 추방하기 기능
- 파티 탈퇴 기능

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

<h3><기능 방면></h3>
➡️ 다른 채팅방과 채팅이 공유되는 이슈
<div>원인 : 같은 채널명으로 실시간 메세지를 구독하도록 설정</div>  
<div>해결 : 분기가 필요했기 때문에 각 채팅방 채널명에 고유 번호를 할당 하였고, 필터링을 해주었다</div>

<h3><디자인 방면></h3>
➡️ 오류케이스에 대한 부분을 놓쳐 디자인 없이 들어간 경우가 있다
<div>해결 : 회의 할 때 더 꼼꼼하게 신경써서 기획하기!!</div>
➡️ 개발자 분들이 작업하면서 전달주시는데 다양한 경우를 고려한 기획이 필요할 것 같습니다
<div>해결 : 이것 또한 모두가 같이 더욱 신경써서 기획하기..!!</div>
➡️ 디자인 시스템 정리가 아직 미흡해서 기본화면과 호버 화면 등 전달에 대한 아쉬움이 있습니다
