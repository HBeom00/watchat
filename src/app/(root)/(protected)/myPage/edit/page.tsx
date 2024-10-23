"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import browserClient from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { getUserId } from '@/utils/getUserId'

const EditProfilePage = () => {
  const router = useRouter()

  // zod
  const editProfile = z.object({
    nickname: z.string().min(2,"닉네임은 필수입니다.")
  })

  // 리액트 훅 폼 (유효성 검사)
  const {register, handleSubmit, formState, watch} = useForm({
    mode: 'onChange',
    defaultValues: {
      nickname:''
    },
    resolver: zodResolver(editProfile)
  })

  //폼 제출 함수
  const onSubmit = async () => {
    const userId = await getUserId();
    const {data: userData, error:updateError} = await browserClient
      .from('user')
      .update({
        nickname:watch('nickname')
      })
      .eq('user_id',userId)

    if(updateError) {
      console.log('프로필 수정에 실패했습니다 => ', updateError)
    }else {
      console.log('프로필 수정에 성공했습니다 => ', userData)
    }

    router.push('/mypage')
  }

  return (
    <section>
      <h1>프로필 수정</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <button type='submit'>수정하기</button>
      </form>
    </section>
  )
}

export default EditProfilePage