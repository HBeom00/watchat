import Link from 'next/link'

const PartyHeader = ({partyNumber}:{partyNumber:string}) => {
  return (
    <div className='flex flex-col gap-7 w-full h-96 justify-center items-center bg-slate-500'>
      <div className='flex flex-row gap-9'>
        <p className='text-4xl mb-8'>타이틀 제목</p>
        <p>8시에 함께 흑백요리사 시청해요</p>
        <Link href={`/participation/${partyNumber}`} className='bg-blue-500 rounded-xl w-30 h-12 p-4'>참여하기</Link>
      </div>
      <div>영상 시청 진도 바</div>
    </div>
  )
}

export default PartyHeader