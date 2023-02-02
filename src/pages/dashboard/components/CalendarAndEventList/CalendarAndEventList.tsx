import { useState } from 'react';
import { Datepicker } from '../../../../components';
import { EventList } from '../EventList';

const CalendarAndEventList = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="mr-10 flex flex-col justify-between gap-y-6 py-10">
      <Datepicker selectedDate={date} selectDate={setDate} />
      <EventList date={date} />
    </div>
  );
};

export default CalendarAndEventList;
