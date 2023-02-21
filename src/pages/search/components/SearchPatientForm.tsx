import { SubmitHandler, useForm } from 'react-hook-form';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../timetable/components/FormForReservation/InputForReserve';
import { useDebouncedCallback, useLazySearchPatient } from '../../../hooks';
import type { PatientsInSearch } from '../../../types/processedGeneratedTypes';

interface SearchPatientFormFields {
  name: string;
}

export const SearchPatientForm = () => {
  const { patientQuery, data } = useLazySearchPatient();

  const [patients, setPatients] = useState<PatientsInSearch>();

  const { register, handleSubmit } = useForm<SearchPatientFormFields>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SearchPatientFormFields> = (data) => {
    const { name } = data;
    if (!name) return null;
    navigate(`/search?name=${name}`);
  };

  const debounceQuery = useDebouncedCallback(patientQuery);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (!value) return setPatients(null);
    debounceQuery(value);
  };

  useEffect(() => {
    if (
      !data?.searchPatient.patients ||
      data?.searchPatient.patients.length < 1
    )
      return setPatients(null);

    setPatients(data.searchPatient.patients);
  }, [data?.searchPatient.patients]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative rounded-md">
      <div className="relative w-36">
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
          {patients.map((patient) => (
            <li
              key={patient.id}
              className="px-1 hover:bg-deep-blue hover:text-white"
            >
              {patient.name}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};
