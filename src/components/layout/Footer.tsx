'use client'

const Footer = () => {
  const options =  "location=no , toolbar=no , menubar =no, status=no"
  const howToUse = () => { 
    window.open(
    "https://www.notion.so/Watchat-13094dc6c14c80a3af88f2a910dd8072",
    "watchat 사용법",
    options,
)
}
const termsOfUse = () => { 
    window.open(
    "https://www.notion.so/13094dc6c14c808984fce7846c23ef08",
    "이용약관",
    options,
)
}
const personalInformation = () =>{
     window.open(
    "https://www.notion.so/13094dc6c14c80459599d85be6ac453d",
    "개인정보처리방침",
    options,
)
}
  return( 
<div className=" bottom-0 w-full bg-gray-100 p-10 ">
  <h1 className="text-[50px]"> WatChat </h1>
  <div className="flex space-x-5">
  <p 
  onClick={howToUse}
  className="cursor-pointer hover:underline"
  >서비스 이용약관</p>
  <p 
  onClick={termsOfUse}
  className="cursor-pointer hover:underline"
  >개인정보 처리방침</p>
  <p 
  onClick={personalInformation}
  className="cursor-pointer hover:underline"
  >서비스 소개</p>
  </div>
  <div>
    <div className="flex space-x-3">
    <p>Contact</p>
    <p>team.watchat@Gmail.com</p>
    </div>
    <div className="flex space-x-3">
     <p>CopyRight</p>
     <p>watchat.All rights reserved</p>
    </div>
  </div>
</div>
  )
};

export default Footer;
