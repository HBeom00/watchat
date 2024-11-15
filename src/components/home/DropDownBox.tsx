// import { useDetectClose } from '@/utils/hooks/useDetectClose';
// import Image from 'next/image';
// import React, { useRef } from 'react';

// type Props = { state: string; onClick: (filter: string) => void };

// const stateArr = ['write_time', 'start_date_time', 'popularity'];

// const orderConversion = (order:string)=>{

// }

// const DropDownBox = ({ state, onClick }: Props) => {
//   const ref = useRef<HTMLDivElement>(null);
//   const [open, setOpen] = useDetectClose(ref, false);

//   // onClick에 들어갈 값...

//   return (
//     <div ref={ref} className="relative z-20">
//       <button onClick={() => setOpen(!open)} className="selectBox">
//         <p>{state === 'write_time' ? '최신순' : state === 'start_date_time' ? '날짜순' : '인기순'}</p>
//         <Image src={'/pageArrow/dropdown_arrow.svg'} width={16} height={16} alt="정렬" />
//       </button>
//       {open && (
//         <div className="selectDropBox w-full">
//           {stateArr.map((n, i) => {
//             return (
//               <button
//                 key={n}
//                 className={
//                   state !== n
//                     ? stateArr.length === i
//                       ? 'selectDropBoxLast'
//                       : 'selectDropBoxIn'
//                     : stateArr.length === i
//                     ? 'selectingDropBoxLast'
//                     : 'selectingDropBoxIn'
//                 }
//                 onClick={() => onClick('')}
//               ></button>
//             );
//           })}
//           <button
//             className={state !== 'write_time' ? 'selectDropBoxIn' : 'selectingDropBoxIn'}
//             onClick={() => onClick('')}
//           >
//             최신순
//           </button>
//           <button
//             className={state !== 'start_date_time' ? 'selectDropBoxIn' : 'selectingDropBoxIn'}
//             onClick={() => onClick('')}
//           >
//             날짜순
//           </button>
//           <button
//             className={state !== 'popularity' ? 'selectDropBoxLast' : 'selectingDropBoxLast'}
//             onClick={() => onClick('')}
//           >
//             인기순
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DropDownBox;
