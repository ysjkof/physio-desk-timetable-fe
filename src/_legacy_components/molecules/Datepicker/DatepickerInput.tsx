import {
  DatepickerErrorState,
  DatepickerInputState,
  HasDateOption,
} from './Datepicker';
import { ChangeEvent, InputHTMLAttributes } from 'react';
import { REG_EXP_DATEPICKER } from '../../../constants/regex';
import { cls } from '../../../utils/common.utils';
import FormError from '../../atoms/FormError';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
interface Inputs {
  attributes: InputProps[];
}
interface InputInDatepickerProps
  extends HasDateOption,
    DatepickerInputState,
    DatepickerErrorState {
  textColor?: string;
}

function Input({ label, ...args }: InputProps) {
  return (
    <label className="relative flex flex-col">
      <span className="position-center-y absolute right-2">{label}</span>
      <input {...args} />
    </label>
  );
}
function Inputs({ attributes }: Inputs) {
  return (
    <>
      {attributes.map((attribute) => {
        return (
          <Input key={`datepicker-input__${attribute.label}`} {...attribute} />
        );
      })}
    </>
  );
}

const DATEPICKER_ERROR = {
  year: '년은 1900년~2099년까지 입력할 수 있습니다',
  month: '월은 1~12까지 입력할 수 있습니다',
  day: '날짜는 1~31까지 입력할 수 있습니다',
  hour: '시각은 00~23까지 입력할 수 있습니다',
  minute: '분은 00~50분까지 입력할 수 있습니다',
};

export default function DatepickerInput({
  inputDate,
  setInputDate,
  error,
  setError,
  textColor,
  hasHour,
}: InputInDatepickerProps) {
  const { day, hour, minute, month, year } = inputDate;

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

    switch (name) {
      case 'year':
        if (value.length > 4) {
          newValue = value.substring(value.length - 4);
        }
        if (validate(newValue, REG_EXP_DATEPICKER[name])) {
          setError('');
          break;
        }
        setError(DATEPICKER_ERROR[name]);
        break;

      default:
        if (validate(newValue, REG_EXP_DATEPICKER[name])) {
          setError('');
          break;
        }
        newValue = value.substring(value.length - 1);
        setError(DATEPICKER_ERROR[name]);
        break;
    }
    setInputDate((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const commonAttribute = { type: 'number', onChange: handleInputChange };

  return (
    <div
      className={cls(
        'datepicker__input relative grid w-full gap-1',
        hasHour
          ? 'grid-cols-[1fr_repeat(4,_0.7fr)]'
          : 'grid-cols-[1fr_repeat(2,_0.7fr)]'
      )}
      style={{ ...(textColor && { color: textColor }) }}
    >
      {error && <FormError errorMessage={error} isHighter />}

      <Inputs
        attributes={[
          {
            ...commonAttribute,
            label: '년',
            name: 'year',
            value: year,
            className: ' input-datepicker',
            placeholder: 'YYYY',
          },
          {
            ...commonAttribute,
            label: '월',
            name: 'month',
            value: month,
            className: ' input-datepicker',
            placeholder: 'MM',
          },
          {
            ...commonAttribute,
            label: '일',
            name: 'day',
            value: day,
            className: ' input-datepicker',
            placeholder: 'DD',
          },
        ]}
      />

      {hasHour && (
        <Inputs
          attributes={[
            {
              ...commonAttribute,
              label: '시',
              name: 'hour',
              value: hour,
              className: ' input-datepicker',
              placeholder: 'HH',
            },
            {
              ...commonAttribute,
              label: '분',
              name: 'minute',
              value: minute,
              className: ' input-datepicker',
              placeholder: 'mm',
              minLength: 1,
              maxLength: 2,
              step: 10,
            },
          ]}
        />
      )}
    </div>
  );
}
