import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { getMonth, getWeekOfMonth } from 'date-fns';
import { AnimatePresence } from 'framer-motion';
import { faRectangleXmark } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { USER_COLORS, VIEW_PERIOD } from '../../../../constants/constants';
import useStore from '../../../../hooks/useStore';
import {
  clinicListsVar,
  loggedInUserVar,
  selectedDateVar,
} from '../../../../store';
import { ROUTES } from '../../../../router/routes';
import localStorageUtils from '../../../../utils/localStorageUtils';
import { getPositionRef } from '../../../../utils/utils';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  UserPlus,
} from '../../../../svgs';
import TableOptionSelector from '../../_legacy_components/molecules/TableOptionSelector';
import ModalPortal from '../../../../_legacy_components/templates/ModalPortal';
import {
  CheckableButton,
  MenuButton,
  TwoLabelSwitch,
} from '../../../../components';
import type { IViewOption } from '../../../../types/common.types';

export default function TableController() {
  const navigate = useNavigate();
  const today = new Date();
  const {
    setSelectedInfo,
    selectedInfo,
    selectedDate,
    viewOptions,
    clinicLists,
  } = useStore();
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

    localStorageUtils.set({
      key: 'viewOption',
      userId: loggedInUser.id,
      userName: loggedInUser.name,
      value,
    });
  };

  useEffect(() => {
    return viewOptions.set({
      ...viewOptions.get,
      seeActiveOption: false,
    });
  }, []);

  const settingRef = useRef<HTMLButtonElement>(null);
  const { top } = getPositionRef(settingRef);
  const toggleViewPeriod = () => {
    const newViewOptions: IViewOption = {
      ...viewOptions.get,
      viewPeriod:
        viewOptions.get.viewPeriod === VIEW_PERIOD.ONE_DAY
          ? VIEW_PERIOD.ONE_WEEK
          : VIEW_PERIOD.ONE_DAY,
    };
    viewOptions.set(newViewOptions);
    invokeSaveViewOptions(newViewOptions);
  };

  const toggleCalender = () => {
    const newViewOptions: IViewOption = {
      ...viewOptions.get,
      navigationExpand: !viewOptions.get.navigationExpand,
    };
    viewOptions.set(newViewOptions);
    invokeSaveViewOptions(newViewOptions);
  };

  const toggleViewOptions = () => {
    const newViewOptions = {
      ...viewOptions.get,
      seeActiveOption: !viewOptions.get.seeActiveOption,
    };
    viewOptions.set(newViewOptions);
    // seeActiveOption은 로컬스토리지에 저장할 필요 없다
  };

  const clinic = clinicLists.find(({ id }) => id === selectedInfo.clinic?.id);

  const toggleUsers = (clinicId: number, memberId: number) => {
    if (!loggedInUser) throw new Error('❌ loginUser가 false입니다');
    const clinicIdx = clinicLists.findIndex(
      (prevClinic) => prevClinic.id === clinicId
    );
    if (clinicIdx === -1) throw new Error('❌ group index가 -1입니다');
    const memberIdx = clinicLists[clinicIdx].members.findIndex(
      (prevMember) => prevMember.id === memberId
    );
    if (memberIdx === -1) throw new Error('❌ member index가 -1입니다');

    const activateLength = clinicLists[clinicIdx].members.filter(
      (member) => member.isActivate
    ).length;
    let isActivate = clinicLists[clinicIdx].members[memberIdx].isActivate;

    if (isActivate && activateLength === 1) {
      return;
    }
    clinicLists[clinicIdx].members[memberIdx].isActivate = !isActivate;
    localStorageUtils.set({
      key: 'clinicLists',
      userId: loggedInUser.id,
      userName: loggedInUser.name,
      value: [...clinicLists],
    });
    clinicListsVar([...clinicLists]);
  };
  const weekNumber = getWeekOfMonth(selectedDate);
  const month = (getMonth(selectedDate) + 1 + '').padStart(2, '0');

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
            onClick={toggleViewPeriod}
            isActivated={viewOptions.get.viewPeriod === VIEW_PERIOD.ONE_WEEK}
          />
          <MenuButton
            onClick={toggleCalender}
            label="달력보기"
            icon={<Calendar />}
            isActivated={viewOptions.get.navigationExpand}
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-between pb-3">
        <div className="flex gap-2">
          {clinic?.members.map((member, i) => (
            <CheckableButton
              key={i}
              color={'black'}
              backgroundColor={USER_COLORS[i].deep}
              isActivated={member.isActivate}
              label={member.user.name}
              onClick={() => toggleUsers(clinic.id, member.id)}
            />
          ))}
        </div>
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
            label="환자 등록하기"
            icon={<UserPlus />}
            backgroundColor="#6BA6FF"
            color="white"
            onClick={() => navigate(ROUTES.create_patient)}
            ref={settingRef}
          />
          <MenuButton
            label="설정"
            icon={<EllipsisVertical />}
            backgroundColor="#6889BB"
            color="white"
            onClick={toggleViewOptions}
            ref={settingRef}
          />

          <AnimatePresence>
            {viewOptions.get.seeActiveOption && (
              <ModalPortal
                top={top}
                right={10}
                closeAction={() => {
                  if (viewOptions.get) {
                    const newViewOptions = {
                      ...viewOptions.get,
                      seeActiveOption: !viewOptions.get.seeActiveOption,
                    };
                    viewOptions.set(newViewOptions);
                  }
                }}
              >
                <TableOptionSelector />
              </ModalPortal>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
