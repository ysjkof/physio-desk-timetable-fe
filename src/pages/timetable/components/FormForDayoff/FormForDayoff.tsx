import { type PropsWithChildren } from 'react';
import { useForm } from 'react-hook-form';
import { addHours } from 'date-fns';
import { DateForm, InputWrapper, MenuButton } from '../../../../components';
import { useStore } from '../../../../store';
import { useCreateDayoff } from '../../hooks';
import AutoCompleteForUser from '../FormForReservation/AutoCompleteForUser';
import { Textarea } from '../../../../components';
import type { FormForDayoffFields } from '../../../../types/formTypes';
import type { FormForDayoffProps } from '../../../../types/propsTypes';
import type { CreateDayoffInput } from '../../../../types/processedGeneratedTypes';

const FormForDayoff = ({ userId, date, closeAction }: FormForDayoffProps) => {
  const clinicId = useStore((state) => state.pickedClinicId);
  const { register, setValue, getValues, handleSubmit } =
    useForm<FormForDayoffFields>({
      defaultValues: { userId, startDate: date, endDate: addHours(date, 2) },
    });

  const { createDayoff } = useCreateDayoff();

  const onSubmit = () => {
    const { startDate, endDate, userId, memo } = getValues();
    const formData: CreateDayoffInput = {
      startDate,
      endDate,
      memo,
      userId,
      clinicId,
    };
    createDayoff(formData);
  };

  const setUserId = (userId: number) => {
    setValue('userId', userId);
  };
  const setStartDate = (date: Date) => {
    setValue('startDate', date);
  };
  const setEndDate = (date: Date) => {
    setValue('endDate', date);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full flex-col gap-5 pt-8"
    >
      <div className="flex basis-full flex-col justify-between gap-5 px-4">
        <InputWrapper label="치료사" htmlFor="치료사" required>
          <AutoCompleteForUser
            label="치료사"
            setParentValue={setUserId}
            userId={userId}
          />
        </InputWrapper>
        <InputWrapper label="시작" htmlFor="시작" required>
          <DateForm
            hasHour
            date={getValues('startDate')}
            setParentValue={setStartDate}
          />
        </InputWrapper>
        <InputWrapper label="종료" htmlFor="종료" required>
          <DateForm
            hasHour
            date={getValues('endDate')}
            setParentValue={setEndDate}
          />
        </InputWrapper>
        <InputWrapper label="메모" htmlFor="메모">
          <Textarea id="메모" rows={5} register={register('memo')} />
        </InputWrapper>
      </div>
      <Buttons>
        <MenuButton
          type="button"
          className="w-full bg-close-bg text-base font-medium text-font-gray"
          onClick={closeAction}
        >
          닫기
        </MenuButton>
        <MenuButton
          onClick={handleSubmit(onSubmit)}
          type="submit"
          className="w-full bg-cst-blue text-base font-medium text-white"
        >
          예약하기
        </MenuButton>
      </Buttons>
    </form>
  );
};

export default FormForDayoff;

export const Buttons = ({ children }: PropsWithChildren) => {
  return <div className="flex gap-4 bg-light-gray px-4 py-4">{children}</div>;
};
