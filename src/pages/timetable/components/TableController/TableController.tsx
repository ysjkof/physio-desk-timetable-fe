import { useEffect, useRef } from 'react';
import { useReactiveVar } from '@apollo/client';
import { addDays, getMonth, getWeekOfMonth, subDays } from 'date-fns';
import { AnimatePresence } from 'framer-motion';
import { faRectangleXmark } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { USER_COLORS } from '../../../../constants/constants';
import {
  hasTableDisplayVar,
  selectedDateVar,
  selectedReservationVar,
} from '../../../../store';
import { getPositionRef } from '../../../../utils/common.utils';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  UserPlus,
} from '../../../../svgs';
import TableOptionSelector from '../../_legacy_components/TableOptionSelector';
import ModalPortal from '../../../../_legacy_components/templates/ModalPortal';
import {
  CheckableButton,
  MenuButton,
  TwoLabelSwitch,
} from '../../../../components';
import { useSelectedClinic, useTableDisplay } from '../../hooks';
import { ClinicsOfClient } from '../../../../models';
import { useNavCreatePatient } from '../../../../hooks';

const TableController = () => {
  const hasTableDisplay = useReactiveVar(hasTableDisplayVar);
  const selectedReservation = useReactiveVar(selectedReservationVar);
  const selectedDate = useReactiveVar(selectedDateVar);

  const today = new Date();

  const { openCreatePatientModal } = useNavCreatePatient();
  const { toggleUser } = useSelectedClinic();

  const { tableDisplay, toggleDisplayController, toggleDisplayOption } =
    useTableDisplay();

  const handleDateNavMovePrev = () => {
    selectedDateVar(subDays(selectedDate, 7));
  };
  const handleDateNavMoveNext = () => {
    selectedDateVar(addDays(selectedDate, 7));
  };

  const settingRef = useRef<HTMLButtonElement>(null);
  const { top } = getPositionRef(settingRef);

  const toggleWeekOrDay = () => {
    toggleDisplayOption('hasWeekView');
  };

  const toggleCalender = () => {
    toggleDisplayOption('seeCalendar');
  };

  const toggleUsers = (memberId: number) => {
    toggleUser(memberId);
  };

  const weekNumber = getWeekOfMonth(selectedDate);
  const month = `${getMonth(selectedDate) + 1}`.padStart(2, '0');

  const clearSelectedReservation = () => {
    selectedReservationVar(undefined);
  };

  useEffect(() => {
    return () => toggleDisplayController(false);
  }, []);

  return (
    <>
      <div className="flex w-full items-center justify-between border-b py-1">
        <div className="flex items-center gap-4">
          <ChevronLeft
            className="rounded-sm border stroke-2"
            iconSize="LG"
            onClick={handleDateNavMovePrev}
          />
          <button
            className="w-32 whitespace-nowrap text-3xl font-medium hover:font-bold"
            onClick={() => selectedDateVar(today)}
            type="button"
          >
            {`${month}월 ${weekNumber}주차`}
          </button>
          <ChevronRight
            className="rounded-sm border stroke-2"
            iconSize="LG"
            onClick={handleDateNavMoveNext}
          />
        </div>
        <div className="flex gap-2">
          <TwoLabelSwitch
            labels={['하루', '주단위']}
            onClick={toggleWeekOrDay}
            isActivated={tableDisplay.hasWeekView}
          />
          <MenuButton
            onClick={toggleCalender}
            isActivated={tableDisplay.seeCalendar}
          >
            <Calendar />
            달력보기
          </MenuButton>
        </div>
      </div>
      <div className="flex w-full items-center justify-between pb-3">
        <div className="flex gap-2">
          {ClinicsOfClient.selectedClinic?.members.map((member, i) => (
            <CheckableButton
              key={i}
              color="black"
              backgroundColor={USER_COLORS[i].deep}
              canSee={!!member.canSee}
              label={member.user.name}
              onClick={() => toggleUsers(member.id)}
            />
          ))}
        </div>
        {selectedReservation && (
          <div className="flex w-full items-center justify-center">
            <span className="mr-4 flex">
              <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-blue-700 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-800" />
            </span>
            <span className="mr-2 scale-150 font-bold">
              {selectedReservation.patient?.name}
            </span>
            님의 예약을 복사했습니다
            <FontAwesomeIcon
              icon={faRectangleXmark}
              fontSize={14}
              onClick={clearSelectedReservation}
              className="ml-2 cursor-pointer hover:scale-125"
            />
          </div>
        )}
        <div className="flex w-full items-center justify-end gap-x-2">
          <MenuButton
            onClick={openCreatePatientModal}
            ref={settingRef}
            className="bg-cst-blue text-white"
          >
            <UserPlus />
            환자 등록하기
          </MenuButton>
          <MenuButton
            onClick={() => toggleDisplayController()}
            ref={settingRef}
            className="bg-deep-blue text-white"
          >
            <EllipsisVertical />
            설정
          </MenuButton>

          <AnimatePresence>
            {hasTableDisplay && (
              <ModalPortal
                top={top}
                right={10}
                closeAction={() => toggleDisplayController(false)}
              >
                <TableOptionSelector />
              </ModalPortal>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default TableController;
