'use client';

import { useRecruitStore } from '../../../../../store/recruitStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Image from 'next/image';
//------컴퍼넌트------------------------------------------------------------------------------
import ParticipationButton from '@/components/button/ParticipationButton';
import { defaultImage } from '@/constants/image';
import { memberFullSwitch } from '@/utils/memberCheck';
//------수파베이스------------------------------------------------------------------------------
import browserClient from '../../../../../utils/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

//------타입------------------------------------------------------------------------------
import { partyInfo } from '@/types/partyInfo';

//------라이브러리------------------------------------------------------------------------------
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from './../../../../../../node_modules/date-fns/locale/ko';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const RecruitNextPage = () => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [partyNumber, setPartyNumber] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [privacySetting, setPrivacySetting] = useState<boolean>(true);
  const [todaySelected, setTodaySelected] = useState(false);
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
        video_platform,
        season_number,
        genres
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
              write_time: new Date(),
              season_number,
              genres,
              privacy_setting: privacySetting ? 'true' : 'false'
            }
          ])
          .select();
      if (error) throw new Error('데이터 삽입 실패');
      // alert('모집이 완료 되었습니다.');

      if (insertPartyData !== null) {
        const { error: ownerInsertError } = await browserClient.from('team_user_profile').insert({
          nickname: '익명',
          profile_image: defaultImage,
          user_id: userId,
          party_id: insertPartyData[0].party_id
        });

        // 이 참가하기로 인해 인원이 가득 찼다면 파티 상태를 모집 마감으로 전환
        // 모집 마감 상태로 전환
        await memberFullSwitch(insertPartyData[0].party_id);

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
    }
  };

  const watchDateChangeHandle = (date: Date | null) => {
    const today = new Date();
    setRecruitDetails({ watch_date: date });
    setTodaySelected(
      date?.getDate() === today.getDate() &&
        date?.getMonth() === today.getMonth() &&
        date?.getFullYear() === today.getFullYear()
    );
  };

  const startTimeChangeHandle = (time: Date | null) => {
    setRecruitDetails({ start_time: time });
  };

  const privacyhandle = (setting: boolean) => {
    setPrivacySetting(setting);
  };

  const isRecruitButtonDisabled =
    !limited_member || !useRecruitStore.getState().watch_date || !useRecruitStore.getState().start_time;

  return (
    <div>
      <div className={`grid place-items-center`}>
        <div className={`flex justify-between space-x-[239px] p-x-[20px] p-y-[8px]`}>
          <button onClick={() => router.back()}>
            <Image src="/arrow_back_black.svg" alt="뒤로가기" width={24} height={24} />
          </button>
          <Link href={'/'}>
            <Image src="/close.svg" alt="나가기" width={24} height={24} />
          </Link>
        </div>
        <h1
          className={`text-[28px] font-bold  mt-[70px]
                        mobile:mt-[9px] mobile:text-[20px]`}
        >
          모집 조건
        </h1>
        <div>
          <div>
            <label htmlFor="open" className="block text-[14px] font-SemiBold text-Grey-800">
              공개 설정
            </label>
            <div className={`flex justify-between mt-[8px] mobile:w-[335px]`}>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="공개"
                  checked={privacySetting === true}
                  onChange={() => privacyhandle(true)}
                  className="hidden "
                />
                <span
                  className={`outline-disabled-btn-l w-[250px] flex items-center justify-center ${
                    privacySetting === true ? 'bg-primary-400 !text-white' : ''
                  } mobile:w-[157px] `}
                >
                  공개
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="비공개"
                  checked={privacySetting === false}
                  onChange={() => privacyhandle(false)}
                  className="hidden "
                />
                <span
                  className={`outline-disabled-btn-l w-[250px]  flex items-center justify-center cursor-pointe ${
                    privacySetting === false ? 'bg-primary-400 !text-white' : ''
                  } mobile:w-[157px]`}
                >
                  비공개
                </span>
              </label>
            </div>
            {privacySetting === false && (
              <p className="mt-[8px] text-[13px] text-Grey-600">
                비공개 모드는 초대하기를 통해 맴버를 모집할 수 있습니다.
              </p>
            )}
          </div>
          <div className="space-y-[32px] mt-[32px]">
            <div className="z-40">
              <div className="flex space-x-[4px] relative group">
                <label htmlFor="member" className="block text-[14px] font-SemiBold text-Grey-800">
                  모집 인원
                </label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Image src="/info_line.svg" width={24} height={24} alt="툴팁" className="cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>모집 인원은 자신을 포함한 인원입니다.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {/* svg */}
              <div className="relative ">
                <Image
                  src="/group.svg"
                  alt="User Icon"
                  width={24}
                  height={24}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                />
                <input
                  id="member"
                  type="text"
                  placeholder="1~10"
                  value={limited_member !== 0 ? limited_member : ''}
                  onChange={handleChange}
                  className={`w-[520px] h-[48px] border-b-[1px] border-b-Grey-400  text-center focus:border-primary-500 focus:outline-none 
                              mobile:w-[335px]`}
                />
                <Image
                  src="/persons.svg"
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
              <label htmlFor="watchDate" className="block text-[14px] font-SemiBold text-Grey-800">
                시청 날짜
              </label>
              <div className="relative z-30">
                <Image
                  src="/calendar_month.svg"
                  alt="User Icon"
                  width={24}
                  height={24}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-20"
                />
                <DatePicker
                  id="watchDate"
                  locale={ko}
                  selected={useRecruitStore.getState().watch_date}
                  onChange={watchDateChangeHandle}
                  dateFormat="yyyy.MM.dd"
                  placeholderText="날짜를 선택해주세요"
                  className={`w-[520px] h-[48px] border-b-[1px] border-b-Grey-400   text-center z-10 focus:border-primary-500 focus:outline-none
                              mobile:w-[335px]`}
                  showPopperArrow={false}
                  minDate={new Date()}
                  popperClassName="custom-datepicker"
                />
              </div>
            </div>
            <div>
              <label htmlFor="startTime" className="block text-[14px] font-SemiBold text-Grey-800">
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
                  onChange={startTimeChangeHandle}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  dateFormat="h:mm aa"
                  className={`w-[520px] h-[48px] border-b-[1px] border-b-Grey-400  text-center focus:border-primary-500 focus:outline-none
                              mobile:w-[335px]`}
                  placeholderText="00:00"
                  popperClassName="custom-scrollbar"
                  minTime={todaySelected ? new Date() : new Date(0, 0, 0, 0, 0, 0)}
                  maxTime={new Date(0, 0, 0, 23, 59, 59)}
                />
              </div>
            </div>
          </div>
        </div>
        <button
          className={`mt-[207px] px-[24px] py-[16px] w-[520px] h-[56px] ${
            isRecruitButtonDisabled ? 'bg-Grey-100 text-Grey-400' : 'bg-primary-400 hover:bg-primary-500 text-white'
          } rounded-md font-semibold text-[15px]
            mobile:w-[335px]`}
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
        />
      </div>
    </div>
  );
};

export default RecruitNextPage;
