import { useMemo, type PropsWithChildren } from 'react';
import { useForm } from 'react-hook-form';
import { addMinutes } from 'date-fns';
import { DateForm, InputWrapper, MenuButton } from '../../../../components';
import AutoCompleteForUser from './AutoCompleteForUser';
import AutoCompleteForPatient from './AutoCompleteForPatient';
import AutoCompleteForPrescription from './AutoCompleteForPrescription';
import { Textarea } from './InputForReserve';
import { ClinicsOfClient, SelectedPrescriptions } from '../../../../models';
import { useFindPrescriptions } from '../../../../hooks';
import type { FormOfReserveFields } from '../../../../types/form.types';
import type { CloseAction } from '../../../../types/props.types';

interface FormForReservationProps extends CloseAction {
  date: Date;
  userId: number;
}

const FormForReservation = ({
  date,
  userId,
  closeAction,
}: FormForReservationProps) => {
  const { register, setValue, getValues, handleSubmit } =
    useForm<FormOfReserveFields>({
      defaultValues: { startDate: date, userId },
    });

  const { data, loading } = useFindPrescriptions();

  const prescriptionList = useMemo(
    () => new SelectedPrescriptions(data?.findPrescriptions.prescriptions),
    [data, loading]
  );

  const onSubmit = () => {
    const { startDate, memo, patientId, prescriptions, userId } = getValues();

    const formData = {
      startDate,
      endDate: addMinutes(startDate, prescriptionList.getSelection().minute),
      memo,
      userId,
      clinicId: ClinicsOfClient.selectedClinic.id,
      patientId,
      prescriptionIds: prescriptions,
    };
    console.log(formData);
  };

  register('userId', { required: true });
  register('patientId', { required: true });
  register('prescriptions', { required: true });
  register('startDate', { required: true });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 pt-8"
    >
      <div className="flex flex-col gap-5 px-4">
        <InputWrapper label="담당치료사" required>
          <AutoCompleteForUser
            label="담당치료사"
            setValue={setValue}
            userId={userId}
          />
        </InputWrapper>
        <InputWrapper label="환자" required>
          <AutoCompleteForPatient label="환자" setValue={setValue} />
        </InputWrapper>
        <InputWrapper label="처방" required>
          <AutoCompleteForPrescription
            label="처방"
            setValue={setValue}
            prescriptionList={prescriptionList}
          />
        </InputWrapper>
        <InputWrapper label="치료일정" required>
          <DateForm date={getValues('startDate')} setValue={setValue} />
        </InputWrapper>
        <InputWrapper label="메모">
          <Textarea label="메모" rows={3} register={register('memo')} />
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

export default FormForReservation;

const Buttons = ({ children }: PropsWithChildren) => {
  return <div className="flex gap-4 bg-light-gray px-4 py-4">{children}</div>;
};
