import { type ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { isArrayAndValue, cls } from '../../../../utils/commonUtils';
import { Input } from '../../../../components';
import { useDebouncedCallback, useLazySearchPatient } from '../../../../hooks';
import type { PatientsInSearch } from '../../../../types/processedGeneratedTypes';
import type { SearchPatientFormFields } from '../../../../types/formTypes';
import { getStringYearMonthDay } from '../../../../utils/dateUtils';

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
        id={label}
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
          {patients.map((patient) => {
            const { registrationNumber, birthday, name } = patient;

            return (
              <li key={patient.id}>
                <button
                  type="button"
                  className="flex w-full flex-col py-1.5 px-3 text-left"
                  onClick={() => select(patient.id, patient.name)}
                >
                  <div>
                    <span>{name}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      {registrationNumber}
                    </span>
                  </div>
                  {birthday && (
                    <span className="whitespace-nowrap text-xs text-gray-500">
                      {getStringYearMonthDay(new Date(birthday))}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default AutoCompleteForPatient;
