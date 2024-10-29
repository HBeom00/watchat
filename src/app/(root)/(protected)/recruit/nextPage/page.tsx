"use client";

import { useRecruitStore } from '../recruitStore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import browserClient from '../../../../../utils/supabase/client';
import { useRouter } from 'next/navigation';

const RecruitPage2 = () => {
    const router = useRouter();

    const {
        limited_member,
        setRecruitDetails,
    } = useRecruitStore();
    const queryClient = useQueryClient();

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
                episode_number, 
                limited_member, 
                watch_date, 
                video_id,
                start_time,
                video_platform = []
                
                } = useRecruitStore.getState();
            const { error } = await browserClient.from('party_info').insert([{
                party_name, 
                video_id,
                video_name, 
                party_detail, 
                duration_time, 
                media_type,
                video_image, 
                episode_number, 
                limited_member, 
                video_platform,
                situation: "모집중",
                watch_date: watch_date ? watch_date.toISOString().split('T')[0] : null,
                start_time: start_time ? start_time.toISOString().split('T')[1] : null,
                owner_id: userId,
            }]);
            if (error) throw new Error("데이터 삽입 실패");
            alert("모집이 업로드 되었습니다.");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['party_info'] });
        },
    });

    return (
        <div className='grid'>
            <button onClick={() => router.back()}>뒤로 가기</button>
            <h1>시청 및 모집 정보 입력</h1>
            <h2>인원</h2>
            <input 
             type="text"
             placeholder='인원을 입력해주세요 (최대 10명)' 
             value={limited_member}
             onChange={(e) => setRecruitDetails({limited_member: Number(e.target.value)})}/>
             
            {/* <select value={limitedMember} onChange={(e) => setRecruitDetails({ limitedMember: e.target.value })}>
                <option value="">인원 선택</option>
                {Array.from({ length: 10 }, (_, i) => <option key={i} value={i + 1}>{i + 1}명</option>)}
            </select> */}
            <h2>시청 날짜</h2>
            <DatePicker 
            selected={useRecruitStore.getState().watch_date}
            onChange={(date) => setRecruitDetails({ watch_date: date })}
            dateFormat="yyyy.MM.dd" // 원하는 날짜 형식
            placeholderText="날짜를 선택해주세요"
            className="p-2 border border-gray-300 rounded-lg shadow-sm"
            showPopperArrow={false}
            minDate={new Date()}
            // minDate={new Date(Date.now() + 9 * 60 * 60 * 1000)}
            />
            <h2>시청 시작시간</h2>
            <DatePicker 
            selected={useRecruitStore.getState().start_time} 
            onChange={(time) => setRecruitDetails({ start_time: time })} 
            showTimeSelect 
            showTimeSelectOnly
            timeIntervals={15} 
            dateFormat="h:mm aa" 
            className="p-2 border border-gray-300 rounded-lg shadow-sm"
            placeholderText="시간을 선택해주세요"
            />
            <button onClick={() => submitRecruit()}>모집하기</button>
        </div>
    );
};

export default RecruitPage2;
