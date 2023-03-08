import { differenceInMinutes } from 'date-fns';
import { getStringOfTime } from '../../../../utils/dateUtils';
import { formatNumber } from '../../../../utils/commonUtils';
import { useGetClinic } from '../../../../hooks';
import type { ReservationOfGetReservationsByInterval } from '../../../../types/processedGeneratedTypes';

interface EventListItemProps {
  event: ReservationOfGetReservationsByInterval;
}

const EventListItem = ({ event }: EventListItemProps) => {
  const { user, patient, startDate, endDate, prescriptions } = event;

  const [clinic] = useGetClinic();

  const member = clinic?.members.find((member) => member.user.id === user.id);

  const patientNumber = formatNumber(patient?.registrationNumber);

  const prescriptionsName = prescriptions?.map((p) => p.name).join();

  const time = `${getStringOfTime(new Date(startDate))} ~ ${getStringOfTime(
    new Date(endDate)
  )}(${differenceInMinutes(new Date(endDate), new Date(startDate))}분)`;

  return (
    <li
      className="event-list__list-item"
      style={{ borderLeftColor: member?.color?.value }}
    >
      <div className="flex w-full flex-col">
        <div className="flex gap-2">
          <span className="text-orange-500">{patientNumber}</span>
          <span>{patient?.name}</span>
        </div>
        <span>{user.name}</span>
        <div className="flex flex-wrap justify-between gap-x-4">
          <span>{prescriptionsName}</span>
          <span>{time}</span>
        </div>
      </div>
    </li>
  );
};

export default EventListItem;
