import { type ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { isArrayAndValue, cls } from '../../../../utils/commonUtils';
import { Input } from './InputForReserve';
import { useDebouncedCallback, useLazySearchPatient } from '../../../../hooks';
import type { PatientsInSearch } from '../../../../types/processedGeneratedTypes';
import type { SearchPatientFormFields } from '../../../../types/formTypes';

interface AutoCompleteForPatientProps {
  label: string;
  setParentValue: (patientId: number) => void;
}

const AutoCompleteForPatient = ({
  label,
  setParentValue,
}: AutoCompleteForPatientProps) => {
  const [patients, setPatients] = useState<PatientsInSearch>();

  const clearPatient = () => setPatients(undefined);

  const { register, setValue } = useForm<SearchPatientFormFields>();

  const { patientQuery, data, loading } = useLazySearchPatient();

  const debounceQuery = useDebouncedCallback(patientQuery);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (!value) return clearPatient();
    debounceQuery(value);
  };

  const select = (id: number, name: string) => {
    setValue('name', name);
    setParentValue(id);
    clearPatient();
  };

  useEffect(() => {
    if (loading) return;
    if (!data || !isArrayAndValue(data.searchPatient.patients)) {
      return clearPatient();
    }

    setPatients(data.searchPatient.patients);
  }, [data?.searchPatient.patients]);

  return (
    <>
      <Input
        label={label}
        placeholder="이름을 입력하면 검색이 가능합니다."
        className={cls(
          'text-cst-blue outline-none',
          patients ? 'rounded-b-none border-2 border-b-0 border-cst-blue' : ''
        )}
        register={register('name', { onChange })}
      />
      {patients && (
        <ul className="absolute z-10 w-full rounded-md rounded-t-none border-2 border-t-0 border-cst-blue bg-white">
          <div className="mx-2 border-b" />
          {patients.map((patient) => (
            <li key={patient.id}>
              <button
                type="button"
                className="w-full py-1.5 px-3 text-left"
                onClick={() => select(patient.id, patient.name)}
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
