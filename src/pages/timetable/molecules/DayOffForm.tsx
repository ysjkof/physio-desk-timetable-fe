import { useReactiveVar } from '@apollo/client';
import { selectedInfoVar } from '../../../store';
import { DatepickerWithInput } from '../../../components/molecules/DatepickerWithInput';
import { Button } from '../../../components/molecules/Button';
import { SelectUser } from './SelectUser';
import { Input } from '../../../components/molecules/Input';
import { UseFormRegister } from 'react-hook-form';
import { IReserveForm } from '../../../types/type';

interface DayOffFormProps {
  register: UseFormRegister<IReserveForm>;
  isValid: boolean;
  loading: boolean;
  setSelectedStartDateState: React.Dispatch<React.SetStateAction<Date | null>>;
  setSelectedEndDateState: React.Dispatch<React.SetStateAction<Date | null>>;
  startDate?: Date;
}

export const DayOffForm = ({
  register,
  isValid,
  loading,
  setSelectedStartDateState,
  setSelectedEndDateState,
  startDate,
}: DayOffFormProps) => {
  const selectedInfo = useReactiveVar(selectedInfoVar);
  const createDefaultEndDate = () => {
    if (!startDate) return;

    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 4);
    return endDate;
  };
  return (
    <>
      <label className="flex flex-col gap-2">
        담당 치료사
        <SelectUser
          members={selectedInfo.clinic?.members ?? []}
          register={register('userId')}
        />
      </label>
      <label className="flex flex-col gap-2">
        시작 시각
        <DatepickerWithInput
          setSelectedDate={setSelectedStartDateState}
          hasHour
          defaultDate={startDate && new Date(startDate)}
        />
      </label>
      <label className="flex flex-col gap-2">
        종료 시각
        <DatepickerWithInput
          setSelectedDate={setSelectedEndDateState}
          hasHour
          defaultDate={createDefaultEndDate()}
        />
      </label>

      <Input
        name="memo"
        label={'메모'}
        placeholder={'간단한 남길 말'}
        register={register('memo', {
          maxLength: { value: 200, message: '최대 200자입니다' },
        })}
        type={'textarea'}
        rows={2}
      />
      <Button
        type="submit"
        canClick={isValid}
        loading={loading}
        textContents="잠금 수정"
      />
    </>
  );
};
