import { type PropsWithChildren } from 'react';
import { useForm } from 'react-hook-form';
import { set } from 'date-fns';
import { DateForm, InputWrapper, MenuButton } from '../../../../components';
import AutoCompleteForUser from './AutoCompleteForUser';
import AutoCompleteForPatient from './AutoCompleteForPatient';
import AutoCompleteForPrescription from './AutoCompleteForPrescription';
import { Textarea } from './InputForReserve';
import { TableTime } from '../../../../models';
import type { FormOfReserveFields } from '../../../../types/form.types';

const FormForReservation = () => {
  const { firstHour, firstMinute } = TableTime.get();
  const { register, setValue, getValues, handleSubmit } =
    useForm<FormOfReserveFields>({
      defaultValues: {
        date: set(new Date(), {
          hours: firstHour,
          minutes: firstMinute,
          seconds: 0,
          milliseconds: 0,
        }),
      },
    });

  const onSubmit = () => {
    console.log(getValues());
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 pt-8"
    >
      <div className="flex flex-col gap-5 px-4">
        <InputWrapper label="담당치료사" required>
          <AutoCompleteForUser label="담당치료사" setValue={setValue} />
        </InputWrapper>
        <InputWrapper label="환자" required>
          <AutoCompleteForPatient label="환자" setValue={setValue} />
        </InputWrapper>
        <InputWrapper label="처방" required>
          <AutoCompleteForPrescription label="처방" setValue={setValue} />
        </InputWrapper>
        <InputWrapper label="치료일정" required>
          <DateForm date={getValues('date')} setValue={setValue} />
        </InputWrapper>
        <InputWrapper label="메모">
          <Textarea label="메모" rows={3} register={register('memo')} />
        </InputWrapper>
      </div>
      <Buttons>
        <MenuButton
          type="button"
          className="w-full bg-close-bg text-base font-medium text-font-gray"
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

export default FormForReservation;

const Buttons = ({ children }: PropsWithChildren) => {
  return <div className="flex gap-4 bg-light-gray px-4 py-4">{children}</div>;
};
