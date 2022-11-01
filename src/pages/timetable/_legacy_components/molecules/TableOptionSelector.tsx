import {
  faBan,
  faCommentSlash,
  faExchange,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, Variants } from 'framer-motion';
import MenuButton from '../../../../_legacy_components/molecules/MenuButton';
import {
  cls,
  getMemberState,
  isStayMember,
  renameUseSplit,
} from '../../../../utils/utils';
import { loggedInUserVar, toastVar } from '../../../../store';
import { NEXT } from '../../../../constants/constants';
import BtnArrow from '../../../../_legacy_components/atoms/ButtonArrow';
import useStore from '../../../../hooks/useStore';
import { useReactiveVar } from '@apollo/client';
import Selectbox from '../../../../_legacy_components/molecules/Selectbox';
import {
  getHoursByUnit,
  getMinutesByUnit,
} from '../../../../services/dateServices';
import { useState } from 'react';
import localStorageUtils from '../../../../utils/localStorageUtils';
import StateBadge from '../../../../_legacy_components/atoms/StateBadge';
import Sidebar from '../../../../_legacy_components/molecules/Sidebar';
import { IMemberWithActivate } from '../../../../types/common.types';
import Check from '../../../../svgs/Check';

interface TableDurationForm {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export default function TableOptionSelector() {
  const {
    setSelectedInfo,
    viewOptions,
    clinicLists,
    clinicListsVar,
    selectedInfo,
  } = useStore();

  const loggedInUser = useReactiveVar(loggedInUserVar);

  const [tableDuration, setTableDuration] = useState<TableDurationForm>({
    endHour: viewOptions.get.tableDuration.endHour,
    endMinute: viewOptions.get.tableDuration.endMinute,
    startHour: viewOptions.get.tableDuration.startHour,
    startMinute: viewOptions.get.tableDuration.startMinute,
  });

  const onClickToggleUser = (clinicId: number, memberId: number) => {
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

  const onClickChangeSelectClinic = (clinicId: number) => {
    if (!loggedInUser) throw new Error('❌ loginUser가 false입니다');
    if (selectedInfo.clinic?.id !== clinicId) {
      const clinic = clinicLists.find((clinic) => clinic.id === clinicId);
      const me = loggedInUser.members?.find(
        (member) => member.clinic.id === clinicId
      );
      if (clinic && me) {
        const newSelectedClinic = {
          id: clinicId,
          name: clinic.name,
          type: clinic.type,
          isManager: me.manager,
          isStayed: me.staying,
          members: clinic.members,
        };

        setSelectedInfo('clinic', newSelectedClinic, () =>
          localStorageUtils.set({
            key: 'selectedClinic',
            userId: loggedInUser.id,
            userName: loggedInUser.name,
            value: newSelectedClinic,
          })
        );
      }
    }
  };

  const onClickChangeSeeActiveOption = () => {
    if (viewOptions.get) {
      viewOptions.set({
        ...viewOptions.get,
        seeActiveOption: !viewOptions.get.seeActiveOption,
      });
    }
  };

  const invokeSaveViewOptions = (value: any) => {
    if (!loggedInUser) throw new Error('로그인 유저 정보가 없습니다');
    viewOptions.set(value, () =>
      localStorageUtils.set({
        key: 'viewOption',
        userId: loggedInUser.id,
        userName: loggedInUser.name,
        value,
      })
    );
  };
  const saveTableDuration = () => {
    const { endHour, endMinute, startHour, startMinute } = tableDuration;
    if (startHour > endHour) {
      toastVar({ messages: ['시작 시간을 끝 시간보다 작게 해주세요.'] });
      return;
    }

    invokeSaveViewOptions({
      ...viewOptions.get,
      seeActiveOption: false,
      tableDuration: {
        startHour,
        startMinute,
        endHour,
        endMinute,
      },
    });
  };

  const changeTableDurationTime = (
    type: keyof TableDurationForm,
    value: number
  ) => {
    const { endHour } = tableDuration;
    if (type === 'startHour' && value >= endHour) {
      setTableDuration((prev) => ({
        ...prev,
        startHour: value,
        endHour: value + 1,
      }));
      toastVar({
        messages: ['시작 시간은 끝 시간보다 작게 해주세요'],
        fade: true,
        milliseconds: 2000,
      });
      return;
    }
    setTableDuration((prev) => ({ ...prev, [type]: value }));
  };

  const startHours = getHoursByUnit(0, 24);
  const endHours = (() => {
    return startHours.filter((hour) => hour > tableDuration.startHour);
  })();
  const startMinutes = getMinutesByUnit(10);
  const endMinutes = startMinutes;

  const { endHour, endMinute, startHour, startMinute } = tableDuration;

  const variants: Variants = {
    init: { x: 300 },
    end: { x: 0, transition: { duration: 0.3 } },
    exit: { x: 300, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={variants}
      initial="init"
      animate="end"
      exit="exit"
      id="table-option-selector"
      className="w-[240px] rounded-md border border-gray-400 bg-white py-2 shadow-cst"
    >
      <div
        id="table-option-selector__header"
        className="flex items-center justify-between border-b px-3 pb-1"
      >
        <span className="group relative z-40 px-1 after:ml-1 after:rounded-full after:border after:px-1 after:content-['?']">
          보기설정
          <p className="bubble-arrow-t-right absolute top-7 -right-4 hidden w-48 rounded-md bg-black p-4 text-white group-hover:block">
            시간표에 표시할 병원이나 사용자를 선택합니다.
          </p>
        </span>
        <BtnArrow direction={NEXT} onClick={onClickChangeSeeActiveOption} />
      </div>
      <div
        id="table-option-selector__view-time"
        className="flex items-center whitespace-nowrap border-b py-1"
      >
        <Selectbox
          selectedValue={`${(startHour + '').padStart(2, '0')}`}
          iconSize={8}
        >
          <Selectbox.Options>
            {startHours.map((hour) => (
              <Selectbox.Option
                key={hour}
                onClick={() => changeTableDurationTime('startHour', hour)}
              >
                {hour}
              </Selectbox.Option>
            ))}
          </Selectbox.Options>
        </Selectbox>
        <Selectbox
          selectedValue={`${(startMinute + '').padStart(2, '0')}`}
          iconSize={8}
        >
          <Selectbox.Options>
            {startMinutes.map((minute) => (
              <Selectbox.Option
                key={minute}
                onClick={() => changeTableDurationTime('startMinute', minute)}
              >
                {minute}
              </Selectbox.Option>
            ))}
          </Selectbox.Options>
        </Selectbox>
        ~
        <Selectbox
          selectedValue={`${(endHour + '').padStart(2, '0')}`}
          iconSize={8}
        >
          <Selectbox.Options>
            {endHours.map((hour) => (
              <Selectbox.Option
                key={hour}
                onClick={() => changeTableDurationTime('endHour', hour)}
              >
                {hour}
              </Selectbox.Option>
            ))}
          </Selectbox.Options>
        </Selectbox>
        <Selectbox
          selectedValue={`${(endMinute + '').padStart(2, '0')}`}
          iconSize={8}
        >
          <Selectbox.Options>
            {endMinutes.map((minute) => (
              <Selectbox.Option
                key={minute}
                onClick={() => changeTableDurationTime('endMinute', minute)}
              >
                {minute}
              </Selectbox.Option>
            ))}
          </Selectbox.Options>
        </Selectbox>
        <MenuButton enabled type="button" onClick={saveTableDuration}>
          <FontAwesomeIcon icon={faExchange} fontSize={14} />
          바꾸기
        </MenuButton>
      </div>
      <div
        id="table-option-selector__toggle-visible-state"
        className="flex items-center gap-2 border-b py-1 px-3"
      >
        <MenuButton
          enabled={viewOptions.get.seeCancel}
          onClick={() => {
            invokeSaveViewOptions({
              ...viewOptions.get,
              seeCancel: !viewOptions.get.seeCancel,
            });
          }}
        >
          <FontAwesomeIcon icon={faBan} fontSize={14} />
          취소
        </MenuButton>
        <MenuButton
          enabled={viewOptions.get.seeNoshow}
          onClick={() => {
            invokeSaveViewOptions({
              ...viewOptions.get,
              seeNoshow: !viewOptions.get.seeNoshow,
            });
          }}
        >
          <FontAwesomeIcon icon={faCommentSlash} fontSize={14} />
          부도
        </MenuButton>
      </div>
      <Sidebar noGap className="divide-y">
        {clinicLists.map((clinic) => {
          const meMember = clinic.members.find(
            (member) => member.user.id === loggedInUser?.id
          );
          if (!meMember) return null;

          const isSelectedClinic = clinic.id === selectedInfo.clinic?.id;

          const { staying, accepted } = meMember;
          const memberState = getMemberState(staying, accepted);
          const isStay = isStayMember(memberState);

          const sortMember = (members: IMemberWithActivate[]) =>
            members.sort((a, b) => {
              if (a.user.name > b.user.name) return 1;
              if (a.user.name < b.user.name) return -1;
              return 0;
            });

          return (
            <Sidebar.Ul
              key={clinic.id}
              removePadding
              opacity={!isSelectedClinic}
              title={
                <Sidebar.Button
                  className={cls(
                    'text-left',
                    isSelectedClinic ? '' : 'font-normal'
                  )}
                  onClick={() => onClickChangeSelectClinic(clinic.id)}
                >
                  <Check className="mr-2" />
                  {renameUseSplit(clinic.name)}
                </Sidebar.Button>
              }
            >
              {isStay ? (
                sortMember(clinic.members).map((member) => {
                  if (!member.staying) return null;
                  return (
                    <Sidebar.Li
                      key={member.id}
                      onClick={() => onClickToggleUser(clinic.id, member.id)}
                      selected={isSelectedClinic && member.isActivate}
                    >
                      {member.user.name}
                    </Sidebar.Li>
                  );
                })
              ) : (
                <StateBadge state={memberState} />
              )}
            </Sidebar.Ul>
          );
        })}
      </Sidebar>
    </motion.div>
  );
}
