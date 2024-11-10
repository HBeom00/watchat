'use client';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import browserClient from '../../../../../utils/supabase/client';
import ParticipationButton from '@/components/button/ParticipationButton';
import { PostgrestError } from '@supabase/supabase-js';
import { PartyInfo } from '@/types/partyInfo';
import { useEffect, useState } from 'react';
import { ko } from './../../../../../../node_modules/date-fns/locale/ko';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const RecruitNextPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [partyNumber, setPartyNumber] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [partyInfo, setPartyInfo] = useState<PartyInfo>({
    party_id: null,
    party_name: '',
    party_detail: null,
    video_name: '',
    video_platform: [{ name: '', logoUrl: '' }],
    video_image: '',
    limited_member: 0,
    duration_time: 0,
    situation: '',
    owner_id: null,
    media_type: '',
    watch_date: null,
    start_time: null,
    episode_number: null,
    popularity: 0,
    backdrop_image: '',
    start_date_time: '',
    end_time: '',
    season_number: 1,
    video_id: 0
  });

  useEffect(() => {
    const {
      party_name,
      party_detail,
      video_id,
      video_name,
      video_platform,
      video_image,
      media_type,
      duration_time,
      episode_number,
      popularity,
      backdrop_image,
      season_number
    } = router.query;

    if (party_name) {
      setPartyInfo((prev) => ({
        ...prev,
        party_name: String(party_name),
        party_detail: String(party_detail || ''),
        video_id: video_id ? Number(video_id) : 0,
        video_name: String(video_name || ''),
        video_platform: video_platform ? JSON.parse(String(video_platform)) : [],
        video_image: String(video_image || ''),
        media_type: String(media_type || ''),
        duration_time: duration_time ? Number(duration_time) : 0,
        episode_number: episode_number ? Number(episode_number) : 0,
        popularity: popularity ? Number(popularity) : 0,
        backdrop_image: String(backdrop_image || ''),
        season_number: season_number ? Number(season_number) : 1
      }));
    }
  }, [router.query]);

  // 참가하기 open
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
      const plusWatchDate = partyInfo.watch_date ? new Date(partyInfo.watch_date.getTime() + 9 * 60 * 60 * 1000) : null;
      const plusStartTime = partyInfo.start_time ? new Date(partyInfo.start_time.getTime() + 9 * 60 * 60 * 1000) : null;
      const start_date_time = new Date(
        `${plusWatchDate?.toISOString().split('T')[0]}T${plusStartTime?.toISOString().split('T')[1]}`
      );
      const end_time = new Date(start_date_time.getTime() + partyInfo.duration_time * 60 * 1000).toISOString();

      const platformData =
        partyInfo.video_platform.length > 0 ? partyInfo.video_platform : [{ name: '알수없음', logoUrl: '알수없음' }];

      const { data: insertPartyData, error }: { data: PartyInfo[] | null; error: PostgrestError | null } =
        await browserClient
          .from('party_info')
          .insert([
            {
              party_name: partyInfo.party_name,
              party_detail: partyInfo.party_detail,
              video_name: partyInfo.video_name,
              video_platform: platformData,
              video_image: partyInfo.video_image,
              limited_member: partyInfo.limited_member,
              duration_time: partyInfo.duration_time,
              situation: '모집중',
              owner_id: userId,
              write_time: new Date(),
              watch_date: plusWatchDate?.toISOString().split('T')[0] || null,
              start_time: plusStartTime?.toISOString().split('T')[1] || null,
              start_date_time: start_date_time.toISOString(),
              end_time: end_time,
              season_number: partyInfo.season_number,
              video_id: partyInfo.video_id
            }
          ])
          .select();

      if (error) throw new Error('데이터 삽입 실패');
      alert('모집이 업로드 되었습니다.');
      if (insertPartyData !== null && insertPartyData.length > 0) {
        const partyId = insertPartyData[0].party_id;
        if (partyId) {
          console.log('파티아이디', partyId);

          const { error: ownerInsertError } = await browserClient.from('team_user_profile').insert({
            nickname: '익명',
            profile_image:
              'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/avatar.png',
            user_id: userId,
            party_id: partyId // party_id가 null이 아닐 때만 사용
          });

          if (ownerInsertError) {
            alert('프로필 업로드에 실패하셨습니다.');
          }

          // partyId가 null이 아닐 때만 상태 업데이트
          setPartyNumber(partyId);
        } else {
          alert('파티 아이디가 생성되지 않았습니다.'); // party_id가 null인 경우
        }
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['party_info'] });
      queryClient.invalidateQueries({ queryKey: ['recruitList'] });
      queryClient.invalidateQueries({ queryKey: ['myParty'] });
    }
  });

  const memberHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const number = Number(value);

    // 1~10 사이의 숫자만 허용
    if (value === '' || (number >= 1 && number <= 10)) {
      setPartyInfo({ ...partyInfo, limited_member: number });
      setErrorMessage(''); // 오류 메시지 초기화
    } else {
      setErrorMessage('1에서 10 사이의 숫자를 입력하세요.');
      e.target.value = ''; // 잘못된 입력값을 지움
    }
  };

  const isRecruitButtonDisabled = !partyInfo.limited_member || !partyInfo.watch_date || !partyInfo.start_time;

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
              value={partyInfo.limited_member !== 0 ? partyInfo.limited_member : ''}
              onChange={memberHandle}
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
              selected={partyInfo.watch_date}
              onChange={(date) => setPartyInfo({ ...partyInfo, watch_date: date })}
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
              selected={partyInfo.start_time}
              onChange={(time) => setPartyInfo({ ...partyInfo, start_time: time })}
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
