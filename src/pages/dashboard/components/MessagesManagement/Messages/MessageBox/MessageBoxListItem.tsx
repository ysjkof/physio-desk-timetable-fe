import {
  MessageStatus,
  StatusName,
} from '../../../../../../types/generatedTypes';
import {
  PatientInSearch,
  messagesWithContentByPatient,
} from '../../../../../../types/processedGeneratedTypes';
import { cls, formatPhoneNumber } from '../../../../../../utils/commonUtils';
import { getStringOfTime } from '../../../../../../utils/dateUtils';

interface MessageBoxListItemProps {
  message: messagesWithContentByPatient[0];
  currentPhone: PatientInSearch['phone'];
}

export const MessageBoxListItem = ({
  message: messages,
  currentPhone,
}: MessageBoxListItemProps) => {
  const {
    content,
    completeTime,
    user: { name },
    status,
    statusName,
    to,
  } = messages;

  let sendingStatus = '';
  if (status === MessageStatus.Completed) sendingStatus = '';
  else if (status === MessageStatus.Processing) sendingStatus = '전송중';
  else if (status === MessageStatus.Ready) sendingStatus = '전송대기';

  const isFailed = statusName === StatusName.Fail;
  return (
    <li className="mb-6 flex w-full max-w-sm items-center justify-between">
      <div className="w-full min-w-[19rem] whitespace-pre-wrap break-words rounded-xl bg-white px-3 py-2 shadow">
        <p className="text-sm">{content}</p>
        <MessageListItemFooter
          name={name}
          to={to}
          isFailed={isFailed}
          isCurrentPhone={currentPhone === to}
          sendingStatus={sendingStatus}
        />
      </div>
      <span className="pl-2 text-xs font-bold text-gray-500">
        {getStringOfTime(completeTime)}
      </span>
    </li>
  );
};

interface MessageListItemFooterProps {
  name: string;
  to: string;
  isFailed: boolean;
  isCurrentPhone: boolean;
  sendingStatus: string;
}

const MessageListItemFooter = ({
  name,
  to,
  isFailed,
  isCurrentPhone,
  sendingStatus,
}: MessageListItemFooterProps) => {
  return (
    <div className="flex justify-end gap-x-2 whitespace-nowrap">
      {sendingStatus && (
        <span className="text-xs font-bold text-cst-blue">{sendingStatus}</span>
      )}
      {!sendingStatus && isFailed && (
        <span className="text-xs font-medium text-red-500">전송실패</span>
      )}
      <span
        className={cls(
          'text-xs text-gray-500',
          isCurrentPhone ? '' : 'font-extralight'
        )}
      >
        to {formatPhoneNumber(to)}
      </span>
      <span className="text-xs text-gray-500">by {name}</span>
    </div>
  );
};
