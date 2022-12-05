import { type PropsWithChildren } from 'react';
import { useForm } from 'react-hook-form';
import { InputWrapper } from '../../../../components';
import { ClinicsOfClient } from '../../../../models';
import AutoCompleteForUser from './AutoCompleteForUser';
import AutoCompleteForPatient from './AutoCompleteForPatient';
import { Input, Textarea } from './InputForReserve';
import type { FormOfReserveFields } from '../../../../types/form.types';

const FormOfReserve = () => {
  const { register, setValue, getValues, handleSubmit } =
    useForm<FormOfReserveFields>();
  const { selectedClinic } = ClinicsOfClient;

  const onSubmit = () => {
    console.log(getValues());
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 border-y py-8"
    >
      <InputWrapper label="담당치료사" required>
        <AutoCompleteForUser label="담당치료사" setValue={setValue} />
      </InputWrapper>
      <InputWrapper label="환자" required>
        <AutoCompleteForPatient label="환자" setValue={setValue} />
      </InputWrapper>
      <InputWrapper label="치료일정" required>
        <Input label="치료일정" required register={register('date')} />
      </InputWrapper>
      <InputWrapper label="처방" required>
        <Input label="처방" required register={register('prescriptions')} />
      </InputWrapper>
      <InputWrapper label="메모">
        <Textarea label="메모" rows={3} register={register('memo')} />
      </InputWrapper>
      <Buttons>
        <button type="button">취소하고 창 닫기</button>
        <button type="submit">예약하기</button>
      </Buttons>
    </form>
  );
};

export default FormOfReserve;

const Buttons = ({ children }: PropsWithChildren) => {
  return <div>{children}</div>;
};
