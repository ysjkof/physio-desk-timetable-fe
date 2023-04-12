import { type ChangeEvent, useEffect, useState } from 'react';
import { UseFormClearErrors, useForm } from 'react-hook-form';
import { isArrayAndValue, cls } from '../../../../utils/commonUtils';
import { Input } from '../../../../components';
import { useDebouncedCallback, useLazySearchPatient } from '../../../../hooks';
import { getStringYearMonthDay } from '../../../../utils/dateUtils';
import FormError from '../../../../components/FormError';
import type { PatientsInSearch } from '../../../../types/processedGeneratedTypes';
import type {
  FormOfReserveFields,
  SearchPatientFormFields,
} from '../../../../types/formTypes';

interface AutoCompleteForPatientProps {
  label: string;
  setParentValue: (patientId: number) => void;
  clearErrors: UseFormClearErrors<FormOfReserveFields>;
}

const AutoCompleteForPatient = ({
  label,
  setParentValue,
  clearErrors: clearParentErrors,
}: AutoCompleteForPatientProps) => {
  const [patients, setPatients] = useState<PatientsInSearch>();
  const [error, setError] = useState('');

  const clearPatient = () => setPatients(undefined);
  const clearPatientAndError = () => {
    clearPatient();
    setError('');
  };

  const { register, setValue } = useForm<SearchPatientFormFields>();

  const { patientQuery, data, loading } = useLazySearchPatient();

  const debounceQuery = useDebouncedCallback(patientQuery);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    clearPatientAndError();
    debounceQuery(value);
  };

  const select = (id: number, name: string) => {
    setValue('name', name);
    setParentValue(id);
    clearPatient();
    clearParentErrors();
  };

  useEffect(() => {
    if (loading) return;
    if (!data) {
      return clearPatient();
    }
    if (!isArrayAndValue(data.getPatientBy.patients)) {
      setError('없는 이름입니다');
      return clearPatient();
    }
    setPatients(data.getPatientBy.patients);
  }, [data?.getPatientBy.patients]);

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
        autoComplete="off"
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
      {error && <FormError error={error} textAlign="left" />}
    </>
  );
};

export default AutoCompleteForPatient;
