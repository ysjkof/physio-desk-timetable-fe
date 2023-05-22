import { MouseEvent, PropsWithChildren, useContext } from 'react';
import { PatientsInSearch } from '../../../../../../types/processedGeneratedTypes';
import { getStringYearMonthDay } from '../../../../../../utils/dateUtils';
import { formatPhoneNumber } from '../../../../../../utils/commonUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useRecipientSearchForm } from './useRecipientSearchForm';
import { MessagesContext } from '../MessagesContext';

interface RecipientSearchFormProps {
  hasPickedPatient: boolean;
}

export const RecipientSearchForm = ({
  hasPickedPatient,
}: RecipientSearchFormProps) => {
  const { hasMorePages, patients, handleInputOnChange, fetchMore } =
    useRecipientSearchForm();

  return (
    <div className="relative w-full">
      <label className="relative">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="position-center-y absolute left-2"
        />
        <input
          onInput={handleInputOnChange}
          name="search"
          type="text"
          className="ml-1 w-full border-b p-1 pl-6 outline-none"
          placeholder="환자 검색"
          autoFocus
        />
      </label>
      <PopUp
        hasMorePages={hasMorePages}
        patients={patients}
        hasPickedPatient={hasPickedPatient}
        fetchMore={fetchMore}
      />
    </div>
  );
};

interface PopUpProps extends RecipientSearchFormProps {
  hasMorePages: boolean;
  patients: PatientsInSearch;
  fetchMore: () => void;
}
const PopUp = ({
  hasPickedPatient,
  hasMorePages,
  patients,
  fetchMore,
}: PopUpProps) => {
  if (!patients || hasPickedPatient || patients.length < 1) return null;
  const { pickPatient } = useContext(MessagesContext);
  return (
    <ul className="absolute top-12 z-10 max-h-72 w-80 overflow-y-scroll rounded-md bg-white text-base shadow-cst">
      {patients.map((patient) => {
        const { registrationNumber, birthday, name, phone } = patient;
        const EMPTY = '-';
        const _birthday = birthday
          ? getStringYearMonthDay(new Date(birthday))
          : EMPTY;
        const _phone = phone ? formatPhoneNumber(phone) : EMPTY;

        const selectPatient = (e: MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          pickPatient({
            patient: { id: patient.id, name, to: patient.phone },
            isNewMessage: true,
          });
        };

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
          onClick={fetchMore}
          className="css_default-button mx-auto w-full rounded-none border-t hover:bg-deep-blue hover:text-white"
          type="button"
        >
          더 불러오기
        </button>
      )}
    </ul>
  );
};

const Span = ({ children }: PropsWithChildren) => (
  <span className="inline-block w-1/3 whitespace-nowrap text-center text-xs text-gray-500">
    {children}
  </span>
);
