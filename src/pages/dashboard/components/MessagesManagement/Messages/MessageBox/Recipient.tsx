import { useContext } from 'react';
import { cls, formatPhoneNumber } from '../../../../../../utils/commonUtils';
import { RecipientSearchForm } from './RecipientSearchForm';
import { MessagesContext } from '../MessagesContext';

export const Recipient = () => {
  const { patient, isNewMessage, toggleNewMessageAndResetPatient } =
    useContext(MessagesContext);
  const name = patient?.name;
  const phone = patient?.to;
  const phoneToString = phone ? `(${formatPhoneNumber(phone)})` : '';

  return (
    <div
      className="flex cursor-pointer items-baseline border-b bg-white px-4"
      onClick={toggleNewMessageAndResetPatient}
    >
      <span className="my-4 text-gray-500">받는 사람:</span>
      <div className="mr-4 grow">
        {isNewMessage && !patient && (
          <RecipientSearchForm hasPickedPatient={!!phone} />
        )}
        {phoneToString && (
          <div className="mx-2 w-fit rounded-lg bg-cst-blue px-3 py-0.5 text-white">
            <span>{name}</span>
            <span className="ml-1.5">{phoneToString}</span>
          </div>
        )}
      </div>
      <NewMessageButton isActiavte={isNewMessage} />
    </div>
  );
};
function NewMessageButton({ isActiavte }: { isActiavte: boolean }) {
  return (
    <button
      className={cls(
        'rounded-md border px-2',
        isActiavte ? 'bg-cst-blue text-white' : ''
      )}
    >
      찾기
    </button>
  );
}
