import { useContext } from 'react';
import { getStringOfTimeOrDate } from '../../../../../../utils/dateUtils';
import { cls } from '../../../../../../utils/commonUtils';
import { MessagesContext } from '../MessagesContext';
import { StatusName } from '../../../../../../types/generatedTypes';
import { MoreDataBtn } from '../components/MoreDataBtn';
import type { messagesEachPatient } from '../../../../../../types/processedGeneratedTypes';

interface PatientListProps {
  patients: messagesEachPatient[] | undefined;
  hasMorePage: boolean;
  fetchMore: () => void;
}

export const PatientList = ({
  patients,
  hasMorePage,
  fetchMore,
}: PatientListProps) => {
  const { patient, pickPatient } = useContext(MessagesContext);
  const SEARCH_BAR_HEIGHT = '42px';

  return (
    <div
      className="overflow-y-scroll mb-20 flex flex-col items-center"
      style={{ height: `calc(100% - ${SEARCH_BAR_HEIGHT})` }}
    >
      <ul className="w-full">
        {patients?.map(({ id, message }) => {
          const {
            to,
            user,
            patient: { name },
            completeTime,
            status,
            statusName,
          } = message;
          const title = name ? name : to;
          const isActivated = patient?.id === id;
          const isFailed = statusName === StatusName.Fail;
          const pickListItem = () => pickPatient({ patient: { id, name, to } });
          return (
            <li
              key={id}
              className={cls(
                'flex flex-col py-3 hover:bg-gray-300 px-4',
                isActivated ? 'border-transparent bg-gray-200' : 'border-b'
              )}
              role="button"
              onClick={pickListItem}
            >
              <div className="flex w-full items-baseline justify-between">
                <span className="font-bold">{title}</span>
                <span className="text-xs">
                  {getStringOfTimeOrDate(completeTime)}
                  <span
                    className={cls(
                      'ml-2 inline-block h-2 w-2 rounded-full',
                      isFailed ? 'bg-red-500' : 'bg-cst-blue'
                    )}
                  />
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      {hasMorePage && (
        <MoreDataBtn fetchMore={fetchMore}>더 불러오기</MoreDataBtn>
      )}
    </div>
  );
};
