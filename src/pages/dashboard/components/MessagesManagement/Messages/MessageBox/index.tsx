import { Fragment, useContext } from 'react';
import { isSameDay, parseISO } from 'date-fns';
import { getStringOfDateOrTodayYesterday } from '../../../../../../utils/dateUtils';
import { useMessageBox } from './useMessageBox';
import { FormForSendMessage } from './SendMessageForm';
import { Recipient } from './Recipient';
import { MessageBoxListItem } from './MessageBoxListItem';
import { MessagesContext } from '../MessagesContext';
import { MoreDataBtn } from '../components/MoreDataBtn';
import { type PatientAtMessage } from '..';

export interface MessageBoxProps {
  setPatient: React.Dispatch<
    React.SetStateAction<PatientAtMessage | undefined>
  >;
  setIsNewMessage: React.Dispatch<React.SetStateAction<boolean>>;
}
export const MessageBox = () => {
  const {
    patient,
    isNewMessage,
    pickPatient,
    toggleNewMessageAndResetPatient,
  } = useContext(MessagesContext);

  const { messages, ulRef, hasMore, fetchMore } = useMessageBox({
    patientId: patient?.id,
    isNewMessage,
  });

  const phone = patient?.to;
  let currentPrintDate: Date;

  return (
    <div className="flex grow flex-col bg-gray-100">
      <Recipient inputMode={isNewMessage} pickPatient={pickPatient} />
      <ul
        className="flex grow flex-col items-center overflow-y-scroll px-4 pt-4"
        ref={ulRef}
      >
        {hasMore && (
          <MoreDataBtn fetchMore={fetchMore}>문자 더 불러오기</MoreDataBtn>
        )}
        {messages?.map((msg) => {
          let dateTitle = null;
          const { id, completeTime } = msg;
          const isoCompleteTime = parseISO(completeTime);

          if (!isSameDay(currentPrintDate, isoCompleteTime)) {
            currentPrintDate = isoCompleteTime;
            dateTitle = (
              <div className="mb-1.5 mt-6 text-center  text-xs text-gray-500">
                {getStringOfDateOrTodayYesterday(completeTime)}
              </div>
            );
          }
          return (
            <Fragment key={id}>
              {dateTitle}
              <MessageBoxListItem message={msg} currentPhone={phone} />
            </Fragment>
          );
        })}
      </ul>
      <FormForSendMessage patient={patient} />
    </div>
  );
};
