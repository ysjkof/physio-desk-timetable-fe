import { PropsWithChildren, type ChangeEvent } from 'react';
import { SearchInput } from '../../../../../components';
import { getStringYearMonthDay } from '../../../../../utils/dateUtils';
import { formatPhoneNumber } from '../../../../../utils/commonUtils';
import type {
  PatientInSearch,
  PatientsInSearch,
} from '../../../../../types/processedGeneratedTypes';

interface SearchPatientFormOfMessageProps {
  patients: PatientsInSearch;
  setPatient: React.Dispatch<React.SetStateAction<PatientInSearch | undefined>>;
  handleInputOnChange: (event: ChangeEvent<HTMLInputElement>) => void;
  enabled: boolean;
  hasMorePages: boolean;
  plusPage: () => void;
}

export const SearchPatientFormOfMessage = ({
  patients,
  setPatient,
  handleInputOnChange,
  enabled,
  hasMorePages,
  plusPage,
}: SearchPatientFormOfMessageProps) => {
  const clearPatient = () => {
    !enabled && setPatient(undefined);
  };

  return (
    <form className="relative rounded-md">
      <div className="relative w-80" onClick={clearPatient}>
        <SearchInput
          id="주 환자 검색창"
          placeholder="환자검색"
          onChange={handleInputOnChange}
        />
      </div>
      {patients && enabled && (
        <ul className="absolute top-11 w-80 z-10 max-h-72 overflow-y-scroll rounded-md border bg-white py-1 text-base shadow-cst">
          {patients.map((patient) => {
            const { registrationNumber, birthday, name, phone } = patient;
            const EMPTY = '-';
            const _birthday = birthday
              ? getStringYearMonthDay(new Date(birthday))
              : EMPTY;
            const _phone = phone ? formatPhoneNumber(phone) : EMPTY;

            const selectPatient = () => setPatient(patient);
            return (
              <li
                key={patient.id}
                className="px-1 hover:bg-deep-blue hover:text-white"
              >
                <button
                  type="button"
                  className="flex w-full flex-col px-3 py-1.5 text-left"
                  onClick={selectPatient}
                >
                  <div className="flex flex-wrap items-baseline">
                    <span className="mr-2">{name}</span>
                    <span className="inline-block whitespace-nowrap text-xs text-gray-500">
                      {registrationNumber}
                    </span>
                  </div>
                  <div className="w-full">
                    <Span>{_birthday}</Span>
                    <Span>{_phone}</Span>
                  </div>
                </button>
              </li>
            );
          })}
          {hasMorePages && (
            <button
              onClick={plusPage}
              className="css_default-button mx-auto rounded-none border-t w-full hover:bg-deep-blue hover:text-white"
              type="button"
            >
              더보기
            </button>
          )}
        </ul>
      )}
    </form>
  );
};

const Span = ({ children }: PropsWithChildren) => (
  <span className="inline-block w-1/3 whitespace-nowrap text-center text-xs text-gray-500">
    {children}
  </span>
);
