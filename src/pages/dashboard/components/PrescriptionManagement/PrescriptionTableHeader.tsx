const PrescriptionTableHeader = () => {
  return (
    <div className="prescription-management__table-row mb-5 text-sm text-[#8D8DAD]">
      <div className="prescription-management__table-row-col1">이름</div>
      <div className="prescription-management__table-row-col2">소요시간</div>
      <div className="prescription-management__table-row-col3">가격</div>
      <div className="prescription-management__table-row-col4">구성</div>
      <div className="prescription-management__table-row-col5">설명</div>
      <div className="prescription-management__table-row-col6">상태</div>
      <div className="prescription-management__table-row-col7" />
    </div>
  );
};

export default PrescriptionTableHeader;
