import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'


import { z } from 'zod'

const page = () => {
  // zod
  const editProfile = z.object({
    nickname: z.string().min(2,"닉네임은 필수입니다.")
  })

  // 리액트 훅 폼 (유효성 검사)
  const {register, handleSubmit, formState, setValue, watch} = useForm({
    mode: 'onChange',
    defaultValues: {
      nickname:''
    },
    resolver: zodResolver(editProfile)
  })

  return (
    <section>
      <h1>프로필 수정</h1>
      <form>
        {/* <Image src={"150"} alt=''/> */}
        <button>(파일선택 버튼)</button>

        <div>
          <label htmlFor='nickname'>닉네임</label>
          <input {...register('nickname')} id="nickname" type='text' required/>
          {formState.errors.nickname && (<span>{formState.errors.nickname.message}</span>)}
        </div>
        <div>
          <label>장르</label>
        </div>
        <div>
          <label>플랫폼</label>
        </div>
        <button>수정하기</button>
      </form>
    </section>
  )
}

export default page