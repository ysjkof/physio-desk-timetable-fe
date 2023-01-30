const VacationTable = () => {
  // TODO: 백엔드 기능 구현하고 연결하기

  return (
    <div className="divide-y border">
      <div className="flex w-full divide-x bg-[#F2F2FF]">
        <div className="basis-28 py-2 text-center">년도</div>
        <div className="basis-40 py-2 text-center">날짜</div>
        <div className="basis-28 py-2 text-center">연차종류</div>
        <div className="basis-80 py-2 text-center">사유</div>
      </div>
      {Array.from({ length: 10 }).map((_, idx) => (
        <EmptyRow key={idx} />
      ))}
    </div>
  );
};

const EmptyRow = () => {
  return (
    <div className="flex w-full divide-x bg-white">
      <div className="h-10 basis-28 py-2 text-center" />
      <div className="h-10 basis-40 py-2 text-center" />
      <div className="h-10 basis-28 py-2 text-center" />
      <div className="h-10 basis-80 py-2 text-center" />
    </div>
  );
};

export default VacationTable;
