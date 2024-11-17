import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/Dialog';
import { MyTooltip } from './Tooltip';
import { WarmingProgress } from './WarmingProgress';
import Image from 'next/image';
import group from '../../../public/primaryGroup.svg';
import { useFetchUserData, useFetchUserId } from '@/store/userStore';
import { useTotalComments, useTotalTemperature } from '@/utils/myPage/getWarming';
import { usePathname } from 'next/navigation';
import doesntExist from '../../../public/nobody.svg';

const WarmingModal = () => {
  const pathname = usePathname();
  const { data: userData } = useFetchUserData();
  const fetchedUserId = useFetchUserId();

  //pathname에 따라 유저아이디 다르게 가져오기
  const userId = pathname === '/my-page' ? userData?.user_id || '' : fetchedUserId || '';

  // 온도 가져오기
  const { data: totalTemperatureData } = useTotalTemperature(userId);

  // 온도를 99로 제한
  const totalTemperature = Math.min(totalTemperatureData || 0, 99);

  // 온도에따라 식빵명칭 다르게
  const getBreadStatus = (temperature: number): string => {
    if (temperature === 0) {
      return '곰팡이난 식빵..?';
    } else if (temperature <= 33) {
      return '식은 식빵';
    } else if (temperature <= 66) {
      return '미지근한 식빵';
    } else {
      return '따뜻한 식빵';
    }
  };

  // 식빵명칭
  const breadStatus = getBreadStatus(totalTemperature);

  // 모든 코멘트 가져오기
  const { data: comment } = useTotalComments(userId);

  // 코멘트가 한개 이상인 것만 가져오기
  const findComments =
    comment?.filter((comment: { comment: string; commentCount: number }) => comment.commentCount > 0) || [];

  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex flex-row gap-[8px] items-center">
          <p className="body-xs">식빵온도</p>
          <MyTooltip />
          <p className="body-xs-bold text-primary-400">{totalTemperature}℃</p>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[340px] gap-0 rounded-[8px]">
        <DialogHeader>
          <DialogTitle className="pb-[16px]">식빵온도</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row justify-between mb-[8px]">
          <span className="body-xs text-Grey-600">{breadStatus}</span>
          <p className="body-xs-bold text-primary-400">{totalTemperature}℃</p>
        </div>
        <WarmingProgress />
        {findComments.length > 0 ? (
          <ul className="mt-[16px] flex flex-col gap-[8px]">
            {findComments.map((commentItme: { comment: string; commentCount: number }, index: number) => (
              <li key={index} className="bg-Grey-50 p-[8px] flex flex-row gap-[16px] rounded-[4px]">
                <div className="flex flex-row gap-[4px] body-s text-primary-400">
                  <Image src={group} width={24} height={24} alt="group" />
                  <span>{commentItme.commentCount}</span>
                </div>
                <p className="body-s">{commentItme.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center mt-[32px] mb-[40px]">
            <Image src={doesntExist} width={21} height={24} alt="최근 함께한 파티원이 없습니다." />
            <p className="body-s text-Grey-600">받은 후기가 아직 없습니다</p>
          </div>
        )}

        <DialogDescription></DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default WarmingModal;
