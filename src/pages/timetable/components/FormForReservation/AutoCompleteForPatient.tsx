import { useEffect, useState } from 'react';
import { useForm, UseFormSetValue } from 'react-hook-form';
import { checkLengthIsZero, cls } from '../../../../utils/common.utils';
import { InputWithRef } from './InputForReserve';
import { useSearchPatient } from '../../../../hooks';
import { useAutoComplete } from '../../../../hooks/useAutoComplete';
import { SelectedValue } from './SelectedValue';
import type { FormOfReserveFields } from '../../../../types/form.types';
import type { SearchPatientQuery } from '../../../../types/generated.types';
import { PatientInSearch } from '../../../../types/common.types';

interface AutoCompleteForPatientProps {
  label: string;
  setValue: UseFormSetValue<FormOfReserveFields>;
}

const AutoCompleteForPatient = ({
  label,
  setValue: setValueOfParentInput,
}: AutoCompleteForPatientProps) => {
  const [selectionList, setSelectionList] =
    useState<SearchPatientQuery['searchPatient']['patients']>();

  const { register, setValue } = useForm<{ name: string }>();

  const { patientQuery, data, loading } = useSearchPatient();

  const firstListItem = data?.searchPatient.patients?.[0];
  const firstButtonId = firstListItem
    ? `auto-complete__patient_${firstListItem.id}-${firstListItem.name}`
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
  } = useAutoComplete<PatientInSearch>({
    firstButtonId,
    setInput(value) {
      if (!value) throw Error('Input 값의 유형이 바르지 않습니다.');
      setValue('name', value.name);
      setValueOfParentInput('patientId', value.id);
    },
    clearList() {
      setSelectionList(null);
    },
    query: (query: string) => patientQuery(query),
  });

  useEffect(() => {
    if (loading) return;
    const freshList = checkLengthIsZero(data?.searchPatient.patients);
    setSelectionList(freshList);

    if (!freshList) return;
    openList();
  }, [data]);

  if (selectedValue)
    return (
      <SelectedValue clearValue={clearValue}>
        {selectedValue.name}
      </SelectedValue>
    );

  return (
    <>
      <InputWithRef
        label={label}
        placeholder="성함을 입력하시면 검색이 가능합니다."
        className={cls(
          'text-cst-blue outline-none',
          hasList && !selectedValue && selectionList
            ? 'rounded-b-none border-2 border-b-0 border-cst-blue'
            : ''
        )}
        register={register('name')}
        onKeyDown={keydownAtInput}
        ref={inputRef}
      />
      {hasList && !selectedValue && selectionList && (
        <ul
          className="absolute z-10 w-full rounded-md rounded-t-none border-2 border-t-0 border-cst-blue bg-white"
          ref={ulRef}
        >
          <div>
            <div className="mx-3 border-b" />
          </div>
          {selectionList.map((patient) => (
            <li key={`auto-complete__patient_${patient.id}-${patient.name}`}>
              <button
                id={`auto-complete__patient_${patient.id}-${patient.name}`}
                type="button"
                value={patient.id}
                className="w-full py-1.5 px-3 text-left"
                onClick={() => select(patient)}
                onKeyDown={keydownAtButton}
              >
                {patient.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default AutoCompleteForPatient;
