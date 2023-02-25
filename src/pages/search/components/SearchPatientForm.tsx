import { SubmitHandler, useForm } from 'react-hook-form';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../../timetable/components/FormForReservation/InputForReserve';
import { useDebouncedCallback, useLazySearchPatient } from '../../../hooks';
import type { PatientsInSearch } from '../../../types/processedGeneratedTypes';
import type { SearchPatientFormFields } from '../../../types/formTypes';
import { getStringYearMonthDay } from '../../../utils/dateUtils';

export const SearchPatientForm = () => {
  const { patientQuery, data, loading } = useLazySearchPatient();

  const [patients, setPatients] = useState<PatientsInSearch>();

  const [params] = useSearchParams();

  const { register, handleSubmit } = useForm<SearchPatientFormFields>({
    defaultValues: { name: params.get('name') || '' },
  });

  const onSubmit: SubmitHandler<SearchPatientFormFields> = (data) => {
    const { name } = data;
    if (!name) return null;
    goSearchWithQuery(name);
  };

  const goSearchWithQuery = (query: string) => {
    navigate(`/search?name=${query}`);
    setPatients(null);
  };
  const navigate = useNavigate();

  const debounceQuery = useDebouncedCallback(patientQuery);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (!value) return setPatients(null);

    debounceQuery(value);
  };

  useEffect(() => {
    if (loading) return;
    if (
      !data?.searchPatient.patients ||
      data?.searchPatient.patients.length < 1
    )
      return setPatients(null);

    setPatients(data.searchPatient.patients);
  }, [data?.searchPatient.patients]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative rounded-md">
      <div className="relative w-44">
        <button
          className="position-center-y absolute right-2 rounded-md border px-2 py-0.5 shadow-sm"
          type="submit"
        >
          검색
        </button>
        <Input
          label="주 환자 검색창"
          placeholder="환자검색"
          register={register('name', { onChange })}
          className="pr-14"
        />
      </div>
      {patients && (
        <ul className="absolute top-10 w-full rounded-md border bg-white py-1 text-base shadow-cst">
          {patients.map((patient) => {
            const { registrationNumber, birthday, name } = patient;

            return (
              <li
                key={patient.id}
                className="px-1 hover:bg-deep-blue hover:text-white"
              >
                <button
                  type="button"
                  className="flex w-full flex-col py-1.5 px-3 text-left"
                  onClick={() => goSearchWithQuery(patient.name)}
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
    </form>
  );
};