const TableChartCard = () => {
  const name = '이성진';
  const totalReservationCount = 320;
  const newPatientCount = 1;
  const reservationCount = 1;
  const noshowCount = 12;
  const cancelCount = 1;

  return (
    <div className="table-chart__card">
      <div className="flex items-center gap-1 px-1.5 text-sm font-medium">
        <div className="h-3 w-3 rounded-sm bg-red-300"></div>
        {name}
      </div>
      <div>
        <div className="flex">
          <div className="table-chart__card-field">총예약</div>
          <div className="table-chart__card-field">신규</div>
          <div className="table-chart__card-field">재방문</div>
          <div className="table-chart__card-field">부도</div>
          <div className="table-chart__card-field">취소</div>
        </div>
        <div className="flex">
          <div className="table-chart__card-field table-chart__card-field-contents">
            {totalReservationCount}
          </div>
          <div className="table-chart__card-field table-chart__card-field-contents">
            {newPatientCount}
          </div>
          <div className="table-chart__card-field table-chart__card-field-contents">
            {reservationCount}
          </div>
          <div className="table-chart__card-field table-chart__card-field-contents">
            {noshowCount}
          </div>
          <div className="table-chart__card-field table-chart__card-field-contents">
            {cancelCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableChartCard;
