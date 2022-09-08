import {
  faCalendarAlt,
  faPlusSquare,
  faRectangleXmark,
} from '@fortawesome/free-regular-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MenuButton } from '../../../../components/molecules/MenuButton';
import { BtnMenuToggle } from '../../../../components/molecules/MenuToggleButton';
import { NEXT, PREV, VIEW_PERIOD } from '../../../../constants/constants';
import { BtnArrow } from '../../../../components/atoms/ButtonArrow';
import { TableOptionSelector } from '../molecules/TableOptionSelector';
import { NavDatepicker } from '../molecules/NavDatepicker';
import { IViewOption } from '../../../../types/type';
import useStore from '../../../../hooks/useStore';
import { loggedInUserVar, selectedDateVar } from '../../../../store';
import { useReactiveVar } from '@apollo/client';
import { ROUTES } from '../../../../router/routes';
import { setStorage } from '../../../../utils/localStorageUtils';

interface TableNavProps {}

const tableNavVarients = {
  ini: (isUp: boolean) => ({ y: isUp ? -40 : 30 }),
  start: { y: 0, transition: { type: 'tween', duration: 0.3 } },
};

export function TableNav({}: TableNavProps) {
  const navigate = useNavigate();
  const today = new Date();
  const { setSelectedInfo, selectedInfo, selectedDate, viewOptions } =
    useStore();
  const loggedInUser = useReactiveVar(loggedInUserVar);

  const handleDateNavMovePrev = () => {
    const date = new Date(selectedDate);
    viewOptions.get.navigationExpand
      ? date.setMonth(date.getMonth() - 1)
      : date.setDate(date.getDate() - 7);
    selectedDateVar(date);
  };
  const handleDateNavMoveNext = () => {
    const date = new Date(selectedDate);
    viewOptions.get.navigationExpand
      ? date.setMonth(date.getMonth() + 1)
      : date.setDate(date.getDate() + 7);
    selectedDateVar(date);
  };

  const invokeSaveViewOptions = (value: any) => {
    if (!loggedInUser) throw new Error('로그인 유저 정보가 없습니다');

    setStorage({
      key: 'viewOption',
      userId: loggedInUser.id,
      userName: loggedInUser.name,
      value,
    });
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
        {selectedInfo.reservation && (
          <div className="flex w-full items-center justify-center">
            <span className="mr-4 flex">
              <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-blue-700 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-800"></span>
            </span>
            <span className="mr-2 scale-150 font-bold">
              {selectedInfo.reservation.patient?.name}
            </span>
            님의 예약을 복사했습니다
            <FontAwesomeIcon
              icon={faRectangleXmark}
              fontSize={14}
              onClick={() => setSelectedInfo('reservation', null)}
              className="ml-2 cursor-pointer hover:scale-125"
            />
          </div>
        )}
        <div className="flex w-full items-center justify-end gap-x-2">
          <MenuButton
            icon={
              <FontAwesomeIcon icon={faPlusSquare} fontSize={14} className="" />
            }
            enabled
            label={'환자등록'}
            onClick={() => navigate(ROUTES.create_patient)}
          />
          <BtnMenuToggle
            onClick={() => {
              const newViewOptions: IViewOption = {
                ...viewOptions.get,
                viewPeriod:
                  viewOptions.get.viewPeriod === VIEW_PERIOD.ONE_DAY
                    ? VIEW_PERIOD.ONE_WEEK
                    : VIEW_PERIOD.ONE_DAY,
              };
              viewOptions.set(newViewOptions);
              invokeSaveViewOptions(newViewOptions);
            }}
            firstEnabled={viewOptions.get.viewPeriod === VIEW_PERIOD.ONE_WEEK}
            secondEnabled={viewOptions.get.viewPeriod === VIEW_PERIOD.ONE_DAY}
            label={['1주일', '하루']}
          />
          {/* ---------------------- 구분선 ---------------------- */}
          <MenuButton
            icon={<FontAwesomeIcon icon={faCalendarAlt} fontSize={14} />}
            enabled={viewOptions.get.navigationExpand}
            label={'달력'}
            onClick={() => {
              const newViewOptions = {
                ...viewOptions.get,
                navigationExpand: !viewOptions.get.navigationExpand,
              };
              viewOptions.set(newViewOptions);
              invokeSaveViewOptions(newViewOptions);
            }}
          />
          {/* <MenuButton
            icon={<FontAwesomeIcon icon={faList} fontSize={14} />}
            enabled={viewOptions.get.seeList}
            label={'목록'}
            onClick={() => {
              const newViewOptions = {
                ...viewOptions.get,
                seeList: !viewOptions.get.seeList,
              };
              viewOptions.set(newViewOptions);
              invokeSaveViewOptions(newViewOptions);
            }}
          /> */}
          <MenuButton
            icon={<FontAwesomeIcon icon={faGear} fontSize={14} />}
            enabled={viewOptions.get.seeActiveOption}
            label={'설정'}
            onClick={() => {
              const newViewOptions = {
                ...viewOptions.get,
                seeActiveOption: !viewOptions.get.seeActiveOption,
              };
              viewOptions.set(newViewOptions);
              // seeActiveOption은 로컬스토리지에 저장할 필요 없다
            }}
          />
          <AnimatePresence>
            {viewOptions.get.seeActiveOption && <TableOptionSelector />}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {viewOptions.get.navigationExpand ? (
          <NavDatepicker varients={tableNavVarients} />
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
