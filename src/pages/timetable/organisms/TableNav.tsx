import { useReactiveVar } from '@apollo/client';
import {
  faCalendarAlt,
  faPlusSquare,
  faRectangleXmark,
} from '@fortawesome/free-regular-svg-icons';
import { faGear, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BtnMenu } from '../../../components/molecules/button-menu';
import { BtnMenuToggle } from '../../../components/molecules/button-menu-toggle';
import { saveViewOptions } from '../../../utils/utils';
import {
  loggedInUserVar,
  selectedDateVar,
  selectedReservationVar,
  viewOptionsVar,
} from '../../../store';
import { NEXT, ONE_DAY, ONE_WEEK, PREV } from '../../../constants/constants';
import { BtnArrow } from '../molecules/button-arrow';
import { TableClinicSelector } from './table-clinic-selector';
import { TableNavExpand } from './table-nav-expand';
import { IViewOption } from '../../../types/type';

interface TableNavProps {
  today: Date;
}

const tableNavVarients = {
  ini: (isUp: boolean) => ({ y: isUp ? -40 : 30 }),
  start: { y: 0, transition: { type: 'tween', duration: 0.3 } },
};

export function TableNav({ today }: TableNavProps) {
  const viewOptions = useReactiveVar(viewOptionsVar);
  const loggedInUser = useReactiveVar(loggedInUserVar);
  const selectedDate = useReactiveVar(selectedDateVar);
  const selectedReservation = useReactiveVar(selectedReservationVar);

  const navigate = useNavigate();

  if (!loggedInUser || !viewOptions) return <></>;

  const handleDateNavMovePrev = () => {
    const date = new Date(selectedDate);
    viewOptions.navigationExpand
      ? date.setMonth(date.getMonth() - 1)
      : date.setDate(date.getDate() - 7);
    selectedDateVar(date);
  };
  const handleDateNavMoveNext = () => {
    const date = new Date(selectedDate);
    viewOptions.navigationExpand
      ? date.setMonth(date.getMonth() + 1)
      : date.setDate(date.getDate() + 7);
    selectedDateVar(date);
  };
  return (
    <>
      <div className="flex w-full items-center justify-between py-1">
        <button
          className="min-w-[120px] font-medium hover:font-bold"
          onClick={() => selectedDateVar(today)}
        >
          {today.toLocaleString('ko-KR', {
            year: '2-digit',
            month: 'short',
            day: 'numeric',
            weekday: 'short',
          })}
        </button>
        {selectedReservation && (
          <div className="flex w-full items-center justify-center">
            <span className="mr-4 flex">
              <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-blue-700 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-800"></span>
            </span>
            <span className="mr-2 scale-150 font-bold">
              {selectedReservation.patient?.name}
            </span>
            님의 예약을 복사했습니다
            <FontAwesomeIcon
              icon={faRectangleXmark}
              fontSize={14}
              onClick={() => selectedReservationVar(null)}
              className="ml-2 cursor-pointer hover:scale-125"
            />
          </div>
        )}
        <div className="flex w-full items-center justify-end gap-x-2">
          <BtnMenu
            icon={
              <FontAwesomeIcon icon={faPlusSquare} fontSize={14} className="" />
            }
            enabled
            label={'환자등록'}
            onClick={() => navigate('create-patient')}
          />
          <BtnMenuToggle
            onClick={() => {
              const newViewOptions: IViewOption = {
                ...viewOptions,
                periodToView:
                  viewOptions.periodToView === ONE_DAY ? ONE_WEEK : ONE_DAY,
              };
              saveViewOptions(newViewOptions, loggedInUser.id);
            }}
            firstEnabled={viewOptions.periodToView === ONE_WEEK}
            secondEnabled={viewOptions.periodToView === ONE_DAY}
            label={['1주일', '하루']}
          />
          {/* ---------------------- 구분선 ---------------------- */}

          <BtnMenu
            icon={<FontAwesomeIcon icon={faCalendarAlt} fontSize={14} />}
            enabled={viewOptions.navigationExpand}
            label={'달력'}
            onClick={() => {
              const newViewOptions = {
                ...viewOptions,
                navigationExpand: !viewOptions.navigationExpand,
              };
              saveViewOptions(newViewOptions, loggedInUser.id);
            }}
          />

          <BtnMenu
            icon={<FontAwesomeIcon icon={faList} fontSize={14} />}
            enabled={viewOptions.seeList}
            label={'목록'}
            onClick={() => {
              const newViewOptions = {
                ...viewOptions,
                seeList: !viewOptions.seeList,
              };
              saveViewOptions(newViewOptions, loggedInUser.id);
            }}
          />
          <BtnMenu
            icon={<FontAwesomeIcon icon={faGear} fontSize={14} />}
            enabled={viewOptions.seeActiveOption}
            label={'설정'}
            onClick={() => {
              const newViewOptions = {
                ...viewOptions,
                seeActiveOption: !viewOptions.seeActiveOption,
              };
              const localViewOptions = {
                ...viewOptions,
                seeActiveOption: false,
              };
              saveViewOptions(
                newViewOptions,
                loggedInUser.id,
                localViewOptions
              );
            }}
          />
          <AnimatePresence>
            {viewOptions.seeActiveOption && <TableClinicSelector />}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {viewOptions.navigationExpand ? (
          <TableNavExpand varients={tableNavVarients} />
        ) : (
          <>
            <div className="absolute top-[25px] left-0 flex h-[29px] w-[38px] items-center bg-white">
              <BtnArrow direction={PREV} onClick={handleDateNavMovePrev} />
            </div>
            <BtnArrow
              direction={NEXT}
              onClick={handleDateNavMoveNext}
              className={
                'absolute top-[25px] right-0 flex h-[29px] items-center'
              }
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
