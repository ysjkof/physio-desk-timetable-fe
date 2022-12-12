import { useEffect, useState } from 'react';
import { useForm, UseFormSetValue } from 'react-hook-form';
import { cls } from '../../../../utils/common.utils';
import { useAutoComplete } from '../../../../hooks';
import { SelectedPrescriptions } from '../../../../models';
import { InputWithRef } from './InputForReserve';
import { SelectedValue } from './SelectedValue';
import { PrescriptionTotal } from './PrescriptionTotal';
import type { FormOfReserveFields } from '../../../../types/form.types';
import type { Prescription } from '../../../../types/generated.types';
import type { SelectedPrescription } from '../../../../types/common.types';

interface AutoCompleteForPrescriptionProps {
  label: string;
  prescriptionList: SelectedPrescriptions;
  setValue: UseFormSetValue<FormOfReserveFields>;
}

const AutoCompleteForPrescription = ({
  label,
  prescriptionList,
  setValue: setValueOfParentInput,
}: AutoCompleteForPrescriptionProps) => {
  const [selectionList, setSelectionList] = useState<Prescription[]>();

  const { register, setValue, getValues } = useForm<{
    prescriptions: string;
  }>();

  const firstListItem = prescriptionList.getAll()[0];
  const firstButtonId = firstListItem
    ? `auto-complete__prescription_${firstListItem.id}-${firstListItem.name}`
    : '';

  const {
    hasList,
    selectedValue,
    ulRef,
    inputRef,
    keydownAtInput,
    keydownAtButton,
    openList,
    select,
    clearValue,
  } = useAutoComplete<number[]>({
    firstButtonId,
    setInput(value) {
      if (!value) throw Error('Input 값의 유형이 바르지 않습니다.');
      setValue('prescriptions', prescriptionList.getNames());
      setValueOfParentInput('prescriptions', value);
    },
  });

  const [selectedPrescription, setSelectedPrescription] =
    useState<SelectedPrescription>(prescriptionList.getSelection());

  const toggleValue = (prescriptionId: number) => {
    const freshSelection = prescriptionList.toggleById(prescriptionId);
    setSelectedPrescription({ ...freshSelection.getSelection() });
    setValue('prescriptions', freshSelection.getNames());
  };

  const handleFocus = () => {
    if (!firstListItem || hasList) return;
    openList();
  };

  useEffect(() => {
    setSelectionList(prescriptionList.getAll());
  }, [prescriptionList.getAll()]);

  if (selectedValue) {
    return (
      <>
        <SelectedValue clearValue={clearValue}>
          {getValues('prescriptions')}
        </SelectedValue>
        {selectedPrescription && (
          <PrescriptionTotal selectedPrescription={selectedPrescription} />
        )}
      </>
    );
  }

  return (
    <>
      <InputWithRef
        label={label}
        placeholder="처방을 입력하시면 검색이 가능합니다."
        className={cls(
          'text-cst-blue outline-none',
          hasList && !selectedValue && selectionList
            ? 'rounded-b-none border-2 border-b-0 border-cst-blue'
            : ''
        )}
        register={register('prescriptions')}
        onKeyDown={keydownAtInput}
        onFocus={handleFocus}
        ref={inputRef}
      />
      {hasList && !selectedValue && !selectionList && (
        <div>처방이 없습니다.</div>
      )}
      {hasList && !selectedValue && selectionList && (
        <ul
          className="absolute z-10 w-full rounded-md rounded-t-none border-2 border-t-0 border-cst-blue bg-white"
          ref={ulRef}
        >
          <div>
            <div className="mx-3 border-b" />
          </div>
          {selectionList.map((prescription) => (
            <li
              key={`auto-complete__patient_${prescription.id}-${prescription.name}`}
              className={cls(
                'border-y',
                selectedPrescription.prescriptions.find(
                  (id) => id === prescription.id
                )
                  ? 'border-cst-blue bg-light-blue'
                  : 'border-transparent'
              )}
            >
              <button
                id={`auto-complete__patient_${prescription.id}-${prescription.name}`}
                type="button"
                value={prescription.id}
                className="w-full py-1.5 px-3 text-left"
                onClick={() => toggleValue(prescription.id)}
                onKeyDown={keydownAtButton}
              >
                {prescription.name}
              </button>
            </li>
          ))}
          <button
            type="button"
            className="w-full bg-cst-blue text-white"
            onClick={() => select(selectedPrescription.prescriptions)}
          >
            적용
          </button>
        </ul>
      )}
    </>
  );
};

export default AutoCompleteForPrescription;
