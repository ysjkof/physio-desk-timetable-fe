import { type Dispatch } from 'react';
import { eachYearOfInterval, isSameYear, set } from 'date-fns';
import { Selectbox } from '../../../../components';
import { getStringYear } from '../../../../utils/dateUtils';

interface DateSelectorProps {
  date: Date;
  setDate: Dispatch<Date>;
}

const DateSelector = ({ date, setDate }: DateSelectorProps) => {
  const today = new Date();

  const years = eachYearOfInterval({
    start: new Date('1970-01-01'),
    end: today,
  }).sort((a, b) => b.getTime() - a.getTime());

  const months: null[] = [];
  months.length = 12;
  months.fill(null);

  const setYear = (year: number) => {
    setDate(set(date, { year }));
  };

  const setMonth = (month: number) => {
    setDate(set(date, { month }));
  };

  return (
    <div className="flex items-center justify-end gap-4">
      <Selectbox
        label={getStringYear(date)}
        hasBorder
        style={{ width: '6.5rem' }}
      >
        <Selectbox.Options>
          {years.map((year, idx) => (
            <Selectbox.Option
              key={year.getTime()}
              onClick={() => setYear(year.getFullYear())}
              isActive={isSameYear(year, date)}
            >
              {getStringYear(year)}
            </Selectbox.Option>
          ))}
        </Selectbox.Options>
      </Selectbox>
      <Selectbox
        label={`${date.getMonth() + 1}월`}
        hasBorder
        style={{ width: '5rem' }}
      >
        <Selectbox.Options>
          {months.map((nothing, idx) => (
            <Selectbox.Option
              key={idx}
              onClick={() => setMonth(idx)}
              isActive={idx === date.getMonth()}
            >
              {`${idx + 1}월`}
            </Selectbox.Option>
          ))}
        </Selectbox.Options>
      </Selectbox>
    </div>
  );
};

export default DateSelector;
