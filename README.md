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

- 상세페이지

  - 참가하기
  - 초대하기
  - 채팅창 들어가는 시간(시청시간 10분 전후) 조절

- 메인페이지
  - 검색, 정렬 및 필터와 페이지네이션
  - 헤더의 검색 필터 쿼리 스트링으로
  -     드롭다운 제작

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

**<supabase 메서드를 사용하여 페이지네이션과 정렬 필터 기능 구현>**

- 헤더의 필터는 useSearchParams로 query string으로 필터링과 검색

![Wachat-Chrome2024-11-0710-13-06-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/5cf30b72-ffd3-432c-8ec8-923619489fd7)

- supabase 메서드(order,textSearch, gte, lte, range)를 이용하여 페이지네이션과 정렬 필터를 결합하였다

![Wachat-Chrome2024-11-0710-38-24-ezgif com-crop (2)](https://github.com/user-attachments/assets/e581defe-b412-4d2b-9319-5120821dafaf)

- 디바운싱을 검색에 적용하여 데이터 요청횟수를 줄였다

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

**<supabase auth를 사용해 이메일과 OAuth 기반의 소셜 로그인 기능 구현>**

- 소셜 로그인(카카오, 구글) 기능 구현
- 로그인 후 발급된 JWT토큰을 쿠키에 저장해 클라이언트측에서 토큰 기반으로 인증 상태를 확인해 인가된 리소스에 접근 ⭕
- 로그인, 회원가입 폼을 react-hook-form 라이브러리를 사용해 구성 ⭕
- register를 이용해 비제어 컴포넌트로 폼을 관리해 실시간 유효성 검사도 진행 ⭕

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

- 예시시

- 참가하기 모달 창은 총 3군데에서 사용되고 한 곳에서는 사용자가 함부로 닫을 수 없지만 나머지 2곳에서는 마음대로 닫을 수 있어야 한다. 때문에 openclose trigger를 컨트롤 할 수 있도록 했다. 이를 고려하여 구성한 모달 창이 button태그 중복 사용으로 인한 chlid props 오류가 떠서 refactoring을 하게 되었다.

  해결책들

  1.  chlid의 버튼 태그를 div 태그로(실패)
  2.  트리거를 따로 만들기(성공)
  3.  2개의 open 컨트롤 상태값 합치기(성공)

- 첫번째 해결책은 트리거 버튼이 비동기 통신 로직을 가지고 있기 때문에 button 태그의 disabled 기능이 필요해서 기각되었다.
- 두번째 해결책은 얼추 성공하였는데 모달창으로 버튼을 감싸지 말고 모달창과 버튼을 따로 두는 방법을 선택했다. chlid props를 내려주지 않기 때문에 button 태그를 중복으로 사용하는 문제는 해결했다. 또한 별도로 존재하는 모달창의 트리거 버튼을 안 보이게 했다.
- 세번째 해결책으로 인해 최종적으로 모달 창 조정을 마쳤다. 기존에 open과 openControl이라는 2개의 상태값을 통해 모달 창을 컨트롤 했는데 이를 하나로 합치고 onOpenChange에서 이를 사용처에 따라 다르게 컨트롤 하도록 하였다.

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
