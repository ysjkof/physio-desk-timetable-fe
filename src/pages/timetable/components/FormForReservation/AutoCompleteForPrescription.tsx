import { useState } from 'react';
import { useForm, type UseFormSetValue } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { isArrayAndValue } from '../../../../utils/commonUtils';
import { PickedPrescriptions } from '../../../../models';
import { PrescriptionTotal } from './PrescriptionTotal';
import { CheckableButton } from '../../../../components';
import type { FormOfReserveFields } from '../../../../types/formTypes';
import type { PickedPrescription } from '../../../../types/commonTypes';

interface AutoCompleteForPrescriptionProps {
  prescriptionList: PickedPrescriptions;
  setValue: UseFormSetValue<FormOfReserveFields>;
}

const AutoCompleteForPrescription = ({
  prescriptionList,
  setValue: setValueOfParentInput,
}: AutoCompleteForPrescriptionProps) => {
  const [isInputMode, setIsInputMode] = useState(false);

  const onInputMode = () => setIsInputMode(true);
  const offInputMode = () => setIsInputMode(false);

  const { setValue, getValues } = useForm<{ prescriptions: string }>();

  const [pickedPrescriptions, setPickedPrescriptions] =
    useState<PickedPrescription>(prescriptionList.get());

  const toggleValue = (prescriptionId: number) => {
    const freshSelection = prescriptionList.toggleById(prescriptionId);
    setPickedPrescriptions({ ...freshSelection.get() });
    setValue('prescriptions', freshSelection.getNames());
    setValueOfParentInput('prescriptions', freshSelection.get().prescriptions);
  };

  const prescriptions = prescriptionList.getAll();

  if (!isArrayAndValue(prescriptions))
    return (
      <div>
        처방이 없습니다.
        <Link
          className="ml-2 font-medium text-blue-500"
          to="/dashboard/clinic/prescriptions/create"
        >
          만들기
        </Link>
      </div>
    );

  return (
    <>
      <button
        className="flex w-full justify-between rounded-md border bg-disable py-2 px-3"
        onClick={onInputMode}
        type="button"
      >
        {getValues('prescriptions') || '선택해주세요'}
      </button>
      <PrescriptionTotal selectedPrescription={pickedPrescriptions} />

      {isInputMode && (
        <div className="absolute top-16 z-10 w-full overflow-hidden rounded-md border-2 border-cst-blue bg-white">
          <ul className="">
            {prescriptions.map((prescription) => (
              <li key={prescription.id}>
                <CheckableButton
                  label={prescription.name}
                  checked={
                    !!pickedPrescriptions.prescriptions.find(
                      (id) => id === prescription.id
                    )
                  }
                  color="rgb(107 166 255)"
                  onClick={() => toggleValue(prescription.id)}
                />
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="w-full bg-cst-blue text-white"
            onClick={offInputMode}
          >
            닫기
          </button>
        </div>
      )}
    </>
  );
};

export default AutoCompleteForPrescription;
