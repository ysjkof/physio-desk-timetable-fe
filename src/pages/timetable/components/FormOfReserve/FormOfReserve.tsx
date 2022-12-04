import { type PropsWithChildren } from 'react';
import { useForm } from 'react-hook-form';
import { InputWrapper } from '../../../../components';
import { ClinicsOfClient } from '../../../../models';
import AutoComplete from './AutoCompleteForReserve';
import { Input, Textarea } from './InputForReserve';
import type { FormOfReserveFields } from '../../../../types/form.types';

const FormOfReserve = () => {
  const { register, setValue } = useForm<FormOfReserveFields>();
  const { selectedClinic } = ClinicsOfClient;

  return (
    <div className="w-96 border px-4">
      <Navigation>
        <Button />
        <Button />
      </Navigation>
      <Form>
        <InputWrapper label="담당치료사" required>
          <AutoComplete
            label="담당치료사"
            members={selectedClinic.members}
            register={register('user')}
            setValue={setValue}
          />
        </InputWrapper>
        <InputWrapper label="환자" required>
          <Input label="환자" required register={register('patient')} />
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
          <Button />
          <Button />
        </Buttons>
      </Form>
    </div>
  );
};

export default FormOfReserve;

const Navigation = ({ children }: PropsWithChildren) => {
  return <div>{children}</div>;
};
const Form = ({ children }: PropsWithChildren) => {
  return <div className="flex flex-col gap-4 border-y py-8">{children}</div>;
};
const Buttons = ({ children }: PropsWithChildren) => {
  return <div>{children}</div>;
};
const Button = () => {
  return <></>;
};
