import { XMark } from '../../../../svgs';

const NotSelected = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-2">
      <XMark className="h-14 w-14 text-[#D4D4EB]" />
      <span className="text-2xl text-[#D4D4EB]">선택된 직원이 없습니다.</span>
      <span className="text-3xl text-[#525485]">목록에서 선택하세요</span>
    </div>
  );
};

export default NotSelected;
