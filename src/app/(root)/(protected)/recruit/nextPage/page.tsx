'use client';

import { useRecruitStore } from '../recruitStore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import browserClient from '../../../../../utils/supabase/client';
// import { useRouter } from 'next/navigation';
import ParticipationButton from '@/components/button/ParticipationButton';
import { PostgrestError } from '@supabase/supabase-js';
import { partyInfo } from '@/types/partyInfo';
import { useEffect, useState } from 'react';
import { ko } from './../../../../../../node_modules/date-fns/locale/ko';
import Image from 'next/image';

const RecruitNextPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [partyNumber, setPartyNumber] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  // const router = useRouter();
  const { limited_member, setRecruitDetails } = useRecruitStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (partyNumber !== '') {
      setOpen(true);
    }
  }, [partyNumber]);

  const { mutate: submitRecruit } = useMutation({
    mutationFn: async () => {
      const { data: userData, error: userError } = await browserClient.auth.getUser();
      if (userError || !userData) throw new Error('유저 정보 가져오기 실패');

      const userId = userData.user.id;
      const {
        party_name,
        video_name,
        party_detail,
        duration_time,
        media_type,
        video_image,
        backdrop_image,
        episode_number,
        limited_member,
        watch_date,
        video_id,
        start_time,
        popularity,
        video_platform
      } = useRecruitStore.getState();

      const plusWatchDate = watch_date ? new Date(watch_date.getTime() + 9 * 60 * 60 * 1000) : null;
      const plusStartTime = start_time ? new Date(start_time.getTime() + 9 * 60 * 60 * 1000) : null;

      const start_date_time = new Date(
        `${plusWatchDate?.toISOString().split('T')[0]}T${plusStartTime?.toISOString().split('T')[1]}`
      );
      // `duration_time`을 더해 `end_time` 생성
      const end_time = new Date(start_date_time.getTime() + duration_time * 60 * 1000).toISOString();

      // 빈값의 플렛폼
      const platformData =
        video_platform && video_platform.length > 0 ? video_platform : [{ name: '알수없음', logoUrl: '알수없음' }];

      const { data: insertPartyData, error }: { data: partyInfo[] | null; error: PostgrestError | null } =
        await browserClient
          .from('party_info')
          .insert([
            {
              party_name,
              video_id,
              video_name,
              party_detail,
              duration_time,
              media_type,
              video_image,
              backdrop_image,
              episode_number,
              limited_member,
              video_platform: platformData,
              situation: '모집중',
              watch_date: plusWatchDate ? plusWatchDate.toISOString().split('T')[0] : null,
              start_time: plusStartTime ? plusStartTime.toISOString().split('T')[1] : null,
              start_date_time: start_date_time.toISOString(),
              end_time,
              owner_id: userId,
              popularity,
              date_recruitment: new Date()
            }
          ])
          .select();
      if (error) throw new Error('데이터 삽입 실패');
      alert('모집이 업로드 되었습니다.');
      if (insertPartyData !== null) {
        console.log('파티아이디', insertPartyData[0].party_id);
        const { error: ownerInsertError } = await browserClient.from('team_user_profile').insert({
          nickname: '익명',
          profile_image:
            'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/avatar.png',
          user_id: userId,
          party_id: insertPartyData[0].party_id
        });

        if (ownerInsertError) {
          alert('프로필 업로드에 실패하셨습니다.');
        }
        setPartyNumber(insertPartyData[0].party_id);
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['party_info'] });
      queryClient.invalidateQueries({ queryKey: ['recruitList'] });
      queryClient.invalidateQueries({ queryKey: ['myParty'] });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const number = Number(value);

    // 1~10 사이의 숫자만 허용
    if (value === '' || (number >= 1 && number <= 10)) {
      setRecruitDetails({ limited_member: number });
      setErrorMessage(''); // 오류 메시지 초기화
    } else {
      setErrorMessage('1에서 10 사이의 숫자를 입력하세요.');
      e.target.value = ''; // 잘못된 입력값을 지움
    }
  };

  const isRecruitButtonDisabled =
    !limited_member || !useRecruitStore.getState().watch_date || !useRecruitStore.getState().start_time;

  return (
    <div className="grid place-items-center">
      {/* <button onClick={() => router.back()}>뒤로 가기</button> */}
      <h1 className="text-[28px] font-bold mt-[70px]">모집 조건</h1>
      <div className="space-y-[32px]">
        <div className="mt-[94px] z-40">
          <label htmlFor="member" className="block text-[15px] font-SemiBold text-Grey-800">
            모집 인원
          </label>
          {/* svg */}
          <div className="relative ">
            <Image
              src="/group.svg" // public 폴더 경로 사용
              alt="User Icon"
              width={24}
              height={24}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            />
            <input
              id="member"
              type="text"
              placeholder="0~10"
              value={limited_member !== 0 ? limited_member : ''}
              onChange={handleChange}
              className="w-[520px] h-[48px] border-b-[1px] border-b-Grey-400  shadow-sm text-center"
            />
            <Image
              src="/persons.svg" // public 폴더 경로 사용
              alt="User Icon"
              width={24}
              height={24}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            />
          </div>
          {errorMessage && (
            <p className="text-red-500">{errorMessage}</p> // 오류 메시지 표시
          )}
          <p className="text-[13px] text-Grey-400">최대 인원은 10명입니다.</p>
        </div>
        <div>
          <label htmlFor="watchDate" className="block text-[15px] font-SemiBold text-Grey-800">
            시청 날짜
          </label>
          <div className="relative z-30">
            <Image
              src="/calendar_month.svg" // public 폴더 경로 사용
              alt="User Icon"
              width={24}
              height={24}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-20"
            />
            <DatePicker
              id="watchDate"
              locale={ko}
              selected={useRecruitStore.getState().watch_date}
              onChange={(date) => setRecruitDetails({ watch_date: date })}
              dateFormat="yyyy.MM.dd" // 원하는 날짜 형식
              placeholderText="날짜를 선택해주세요"
              className="w-[520px] h-[48px] border-b-[1px] border-b-Grey-400  shadow-sm text-center z-10"
              showPopperArrow={false}
              minDate={new Date()}
              popperClassName="custom-datepicker"
            />
          </div>
        </div>
        <div>
          <label htmlFor="startTime" className="block text-[15px] font-SemiBold text-Grey-800">
            시작 시간
          </label>
          <div className="relative ">
            <Image
              src="/schedule.svg"
              alt="User Icon"
              width={24}
              height={24}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10"
            />
            <DatePicker
              id="startTime"
              locale={ko}
              selected={useRecruitStore.getState().start_time}
              onChange={(time) => setRecruitDetails({ start_time: time })}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              dateFormat="h:mm aa"
              className="w-[520px] h-[48px] border-b-[1px] border-b-Grey-400  shadow-sm text-center  "
              placeholderText="00:00"
            />
          </div>
        </div>
      </div>
      <button
        className={`mt-[200px] px-[24px] py-[16px] w-[520px] h-[56px] ${
          isRecruitButtonDisabled ? 'bg-Grey-100 text-Grey-400' : 'bg-primary-400 hover:bg-primary-500 text-white'
        } rounded-md font-semibold text-[15px]`}
        onClick={() => {
          if (!isRecruitButtonDisabled) {
            submitRecruit();
          }
        }}
        disabled={isRecruitButtonDisabled}
      >
        모집하기
      </button>
      <ParticipationButton
        openControl={open}
        party_id={partyNumber}
        party_situation="모집중"
        isLogin={true}
        setOpenControl={setOpen}
      ></ParticipationButton>
    </div>
  );
};

export default RecruitNextPage;
