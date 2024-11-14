import { member } from '@/types/partyMember';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

const WarmingMemberCardList = ({
  memberData,
  memberSelect,
  setMemberSelect,
  ownerId
}: {
  memberData: member[];
  memberSelect: number;
  setMemberSelect: Dispatch<SetStateAction<number>>;
  ownerId: string | undefined;
}) => {
  return (
    <div className="flex flex-row items-center overflow-x-auto custom-scrollbar">
      {memberData.map((member, i) => {
        return (
          <div
            key={member.profile_id}
            onClick={() => setMemberSelect(i)}
            className={`flex flex-col gap-[4px] pb-[4px] justify-center items-center w-[68px] ${
              memberSelect === i ? ' border-solid border-primary-400 border-b-[2px]' : ''
            }`}
          >
            <Image src={member.profile_image} width={40} height={40} className="rounded-full" alt={member.nickname} />
            <div className="flex flex-row">
              {ownerId === member.user_id ? (
                <div className="flex w-[20px] h-[20px] p-[2.5px] justify-center items-center flex-shrink-0">
                  <Image src={'/owner_icon.svg'} width={15} height={15} alt="파티오너" />
                </div>
              ) : (
                <></>
              )}
              <p className="text-overflow-hidden text-Grey-900 text-center">{member.nickname}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WarmingMemberCardList;
