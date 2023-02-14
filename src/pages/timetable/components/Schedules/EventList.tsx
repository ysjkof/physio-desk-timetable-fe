import { differenceInMinutes } from 'date-fns';
import { getStringOfTime } from '../../../../utils/date.utils';
import { PersonPlus } from '../../../../svgs';
import type {
  ReservationInList,
  ISchedules,
} from '../../../../types/common.types';

const EventList = ({ events }: { events: ISchedules }) => {
  const sortedEvents = events.members
    .flat(1)
    .map((member) => member.events)
    .flat(1)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  return (
    <div className="flex basis-full flex-col pl-2 pr-6">
      <div className="timetable-date-title">예약 목록</div>
      <ul className="flex h-screen flex-col gap-4 overflow-y-scroll shadow-b">
        {sortedEvents.length === 0 ? (
          <span className="mt-10 text-center text-xl">예약이 없습니다</span>
        ) : (
          sortedEvents.map((event) => {
            return <EventListItem key={event.id} event={event} />;
          })
        )}
      </ul>
    </div>
  );
};

interface EventListItemProps {
  event: ReservationInList;
}

const EventListItem = ({ event }: EventListItemProps) => {
  const { user, patient, startDate, endDate, prescriptions } = event;

  const patientNumber = new Intl.NumberFormat('ko-KR').format(
    patient?.registrationNumber || 0
  );

  const prescriptionsName = prescriptions?.map((p) => p.name).join();

  const time = `${getStringOfTime(new Date(startDate))} ~ ${getStringOfTime(
    new Date(endDate)
  )}(${differenceInMinutes(new Date(endDate), new Date(startDate))}분)`;

  return (
    <li className="flex items-center gap-4 rounded-lg border bg-white px-4 py-3">
      <EventListItemIcon />
      <div className="flex flex-col text-base">
        <div className="flex gap-2">
          <span>{patient?.name}</span>
          <span className="text-orange-500">{patientNumber}</span>
        </div>
        <span>{user.name}</span>
        <div className="flex flex-wrap gap-4">
          <span>{prescriptionsName}</span>
          <span>{time}</span>
        </div>
      </div>
    </li>
  );
};

const EventListItemIcon = () => {
  return (
    <div className="flex aspect-square h-full items-center justify-center rounded-lg bg-[#6BA6FF] p-1 text-white">
      <PersonPlus className="h-full w-full" />
    </div>
  );
};

export default EventList;
