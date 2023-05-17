import { FormEvent, useContext } from 'react';
import { cls, formatPhoneNumber } from '../../../../../../utils/commonUtils';
import { PatientAtMessage } from '..';
import { RecipientSearchForm } from './RecipientSearchForm';
import { MessagesContext } from '../MessagesContext';

interface RecipientProps {
  inputMode: boolean;
  pickPatient: (patient: PatientAtMessage) => void;
}
export const Recipient = ({ inputMode, pickPatient }: RecipientProps) => {
  const name = useContext(MessagesContext).patient?.name;
  const phone = useContext(MessagesContext).patient?.to;
  const phoneToString = phone ? `(${formatPhoneNumber(phone)})` : '';

  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);
  //   const search = formData.get('search') as string;
  // };
  const toggleNewMessageAndResetPatient =
    useContext(MessagesContext).toggleNewMessageAndResetPatient;

  return (
    <div
      className="flex cursor-pointer items-baseline border-b bg-white px-4"
      onClick={toggleNewMessageAndResetPatient}
    >
      <span className="my-4 text-gray-500">받는 사람:</span>
      <div className="mr-4 grow">
        {inputMode && (
          <RecipientSearchForm
            hasPickedPatient={!!phone}
            pickPatient={pickPatient}
          />
        )}
        {phoneToString && (
          <div
            className="mx-2 w-fit rounded-lg bg-cst-blue px-3 py-0.5 text-white"
            onClick={() => {}}
          >
            <span>{name}</span>
            <span className="ml-1.5">{phoneToString}</span>
          </div>
        )}
      </div>
      <NewMessageButton />
    </div>
  );
};
function NewMessageButton() {
  const isNewMessage = useContext(MessagesContext).isNewMessage;
  return (
    <button
      className={cls(
        'rounded-md border px-2',
        isNewMessage ? 'bg-cst-blue text-white' : ''
      )}
    >
      찾기
    </button>
  );
}
