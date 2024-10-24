import React from "react";

const page = () => {
  return <>
  {/* 프로필 영역 */}
  <section>
      {/* <Image src={150} alt=""/> */}
      <h3>닉네임</h3>
      <button>팔로잉 255명</button>
      <div>
        <div>
          <span>내 구독 채널</span>
          <span></span>
        </div>
        <div>
          <span>내 취향</span>
          <span></span>
        </div>
      </div>
      <div>
        <button>프로필 편집</button>
        <button>파티 모집하기</button>
      </div>
  </section>

  {/* 파티 및 파티원 영역  */}
  <section>
    <article><h3>참여한 파티</h3></article>
    <article><h3>내가 오너인 파티</h3></article>
    <article><h3>초대받은 파티</h3></article>
    <article><h3>최근 함께했던 파티원</h3></article>
  </section>
  </>;
};

export default page;
