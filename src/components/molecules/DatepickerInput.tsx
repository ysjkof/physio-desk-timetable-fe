import FormError from '../atoms/FormError';
import {
  DatepickerErrorState,
  DatepickerInputState,
  HasDateOption,
} from './DatepickerWithInput';
import { cls } from '../../utils/utils';
import { ChangeEvent } from 'react';
import { REG_EXP_DATEPICKER } from '../../constants/regex';

interface InputInDatepickerProps
  extends HasDateOption,
    DatepickerInputState,
    DatepickerErrorState {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  textColor?: string;
}

const DATEPICKER_ERROR = {
  year: '년은 1900년~2099년까지 입력할 수 있습니다',
  month: '월은 01~12까지 입력할 수 있습니다',
  day: '날짜는 01~31까지 입력할 수 있습니다',
  hour: '시각은 00~23까지 입력할 수 있습니다',
  minute: '분은 00~50분까지 입력할 수 있습니다',
};

export default function DatepickerInput({
  inputDate,
  setInputDate,
  error,
  setError,
  setOpen,
  textColor,
  hasHour,
}: InputInDatepickerProps) {
  const validate = (value: string, regExp: RegExp) => {
    return new RegExp(regExp).test(value);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { value, name } = event.currentTarget as {
      value: string;
      name: 'year' | 'month' | 'day' | 'hour' | 'minute';
    };
    let newValue = event.currentTarget.value;
    let isValidate = false;

    switch (name) {
      case 'year':
        if (value.length > 4) {
          newValue = value.substring(value.length - 4);
        }
        isValidate = validate(newValue, REG_EXP_DATEPICKER[name]);
        isValidate ? setError('') : setError(DATEPICKER_ERROR[name]);
        setInputDate((prevState) => ({
          ...prevState,
          [name]: newValue,
        }));
        return;
      case 'month':
        if (value.length > 2) {
          newValue = value.substring(value.length - 2);
        }
        isValidate = validate(newValue, REG_EXP_DATEPICKER[name]);
        isValidate ? setError('') : setError(DATEPICKER_ERROR[name]);
        setInputDate((prevState) => ({
          ...prevState,
          [name]: newValue,
        }));
        return;
      case 'day':
        if (value.length > 2) {
          newValue = value.substring(value.length - 2);
        }
        isValidate = validate(newValue, REG_EXP_DATEPICKER[name]);
        isValidate ? setError('') : setError(DATEPICKER_ERROR[name]);
        setInputDate((prevState) => ({
          ...prevState,
          [name]: newValue,
        }));
        return;
      case 'hour':
        if (value.length > 2) {
          newValue = value.substring(value.length - 2);
        }
        isValidate = validate(newValue, REG_EXP_DATEPICKER[name]);
        isValidate ? setError('') : setError(DATEPICKER_ERROR[name]);
        setInputDate((prevState) => ({
          ...prevState,
          [name]: newValue,
        }));
        return;
      case 'minute':
        if (value.length > 2) {
          newValue = value.substring(value.length - 2);
        }
        isValidate = validate(newValue, REG_EXP_DATEPICKER[name]);
        isValidate ? setError('') : setError(DATEPICKER_ERROR[name]);
        setInputDate((prevState) => ({
          ...prevState,
          [name]: newValue,
        }));
        return;
      default:
        throw new Error('있을 수 없는 접근입니다');
    }
  };
  return (
    <div
      className={cls(
        'relative grid w-full gap-1',
        hasHour
          ? 'grid-cols-[1fr_repeat(4,_0.7fr)]'
          : 'grid-cols-[1fr_repeat(2,_0.7fr)]'
      )}
      onFocus={() => (setOpen ? setOpen(true) : undefined)}
      style={{ ...(textColor && { color: textColor }) }}
    >
      {error && <FormError errorMessage={error} isHighter />}
      <label className="relative flex flex-col">
        <span className="position-center-y absolute right-2">년</span>
        <input
          name="year"
          value={inputDate.year}
          onChange={handleInputChange}
          type="number"
          className=" input-datepicker"
          placeholder="YYYY"
        />
      </label>
      <label className="relative flex flex-col">
        <span className="position-center-y absolute right-2">월</span>
        <input
          name="month"
          value={inputDate.month}
          onChange={handleInputChange}
          type="number"
          className=" input-datepicker"
          placeholder="MM"
        />
      </label>
      <label className="relative flex flex-col">
        <span className="position-center-y absolute right-2">일</span>
        <input
          name="day"
          value={inputDate.day}
          onChange={handleInputChange}
          type="number"
          className=" input-datepicker"
          placeholder="DD"
        />
      </label>
      {hasHour && (
        <>
          <label className="relative flex flex-col">
            <span className="position-center-y absolute right-2">시</span>
            <input
              name="hour"
              value={inputDate.hour}
              onChange={handleInputChange}
              type="number"
              className=" input-datepicker"
              placeholder="HH"
            />
          </label>
          <label className="relative flex flex-col">
            <span className="position-center-y absolute right-2">분</span>
            <input
              name="minute"
              value={inputDate.minute}
              onChange={handleInputChange}
              type="number"
              className=" input-datepicker"
              placeholder="mm"
              minLength={1}
              maxLength={2}
              step={10}
            />
          </label>
        </>
      )}
    </div>
  );
}
