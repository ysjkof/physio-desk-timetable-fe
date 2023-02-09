const PrescriptionItemHeader = () => {
  return (
    <div className="prescription-management-item mb-5 text-sm text-[#8D8DAD]">
      <div className="prescription-management-item__col1">이름</div>
      <div className="prescription-management-item__col2">소요시간</div>
      <div className="prescription-management-item__col3">가격</div>
      <div className="prescription-management-item__col4">구성</div>
      <div className="prescription-management-item__col5">설명</div>
      <div className="prescription-management-item__col6">상태</div>
      <div className="prescription-management-item__col7" />
    </div>
  );
};

export default PrescriptionItemHeader;
