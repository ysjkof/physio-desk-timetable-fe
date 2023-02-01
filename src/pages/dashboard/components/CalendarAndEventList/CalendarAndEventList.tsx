import { useState } from 'react';
import { Datepicker } from '../../../../components';
import { EventList } from '../EventList';

const CalendarAndEventList = () => {
  const [date, setDate] = useState(new Date());

  // TODO: 데이트 피커 클릭한 날짜 CSS 표시. 더블클릭시 선택되기.
  // TODO: EventList 개선
  return (
    <div className="mr-10 flex flex-col gap-y-6 py-10">
      <Datepicker setDate={setDate} />
      <EventList date={date} />
    </div>
  );
};

export default CalendarAndEventList;
