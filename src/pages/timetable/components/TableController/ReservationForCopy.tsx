import { faRectangleXmark } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setPickedReservation, useStore } from '../../../../store';

const PickedReservation = () => {
  const pickedReservation = useStore((state) => state.pickedReservation);

  const clearSelectedReservation = () => {
    setPickedReservation(undefined);
  };

  if (!pickedReservation) return null;
  return (
    <div className="flex items-center justify-center whitespace-nowrap">
      <span className="mr-4 flex">
        <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-blue-700 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-800" />
      </span>
      <span className="mr-2 scale-150 font-bold">
        {pickedReservation.patient?.name}
      </span>
      님의 예약을 복사했습니다
      <FontAwesomeIcon
        icon={faRectangleXmark}
        fontSize={14}
        onClick={clearSelectedReservation}
        className="ml-2 cursor-pointer hover:scale-125"
      />
    </div>
  );
};

export default PickedReservation;
