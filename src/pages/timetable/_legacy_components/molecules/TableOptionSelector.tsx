import { useReactiveVar } from '@apollo/client';
import { faBan, faCommentSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, Variants } from 'framer-motion';
import {
  cls,
  getMemberState,
  isStayMember,
  renameUseSplit,
} from '../../../../utils/utils';
import { loggedInUserVar, tableTimeVar, toastVar } from '../../../../store';
import { NEXT } from '../../../../constants/constants';
import useStore from '../../../../hooks/useStore';
import { Selectbox } from '../../../../components/Selectbox';
import {
  getHoursByUnit,
  getMinutesByUnit,
} from '../../../../services/dateServices';
import localStorageUtils from '../../../../utils/localStorageUtils';
import MenuButton from '../../../../_legacy_components/molecules/MenuButton';
import BtnArrow from '../../../../_legacy_components/atoms/ButtonArrow';
import StateBadge from '../../../../_legacy_components/atoms/StateBadge';
import Sidebar from '../../../../_legacy_components/molecules/Sidebar';
import Check from '../../../../svgs/Check';
import { useTableDisplay } from '../../hooks';
import { TableDisplay, TableTime } from '../../../../models';
import type {
  FirstAndLastTime,
  IMemberWithActivate,
} from '../../../../types/common.types';

export default function TableOptionSelector() {
  const { setSelectedInfo, clinicLists, clinicListsVar, selectedInfo } =
    useStore();

  const { toggleDisplayController, toggleDisplayOption } = useTableDisplay();

  const tableTime = useReactiveVar(tableTimeVar);

  const loggedInUser = useReactiveVar(loggedInUserVar);

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

  const toggleSeeCancel = () => {
    toggleDisplayOption('seeCancel');
  };
  const toggleSeeNoshow = () => {
    toggleDisplayOption('seeNoshow');
  };

  const changeTableTime = (type: keyof FirstAndLastTime, value: number) => {
    if (!loggedInUser) throw new Error('로그인 유저 정보가 없습니다');

    let tableTimeOptions = { ...tableTime, [type]: value };

    if (type === 'firstHour' && value >= tableTime.lastHour) {
      tableTimeOptions = {
        ...tableTime,
        firstHour: value,
        lastHour: value + 1,
      };

      toastVar({
        messages: ['시작 시간은 끝 시간보다 작게 해주세요'],
        fade: true,
        milliseconds: 2000,
      });
      return;
    }

    TableTime.saveToLocalStorage(tableTimeOptions);

    tableTimeVar(tableTimeOptions);
  };

  const startHours = getHoursByUnit(0, 24);
  const endHours = (() => {
    return startHours.filter((hour) => hour > tableTime.firstHour);
  })();
  const startMinutes = getMinutesByUnit(10);
  const endMinutes = startMinutes;

  const { lastHour, lastMinute, firstHour, firstMinute } = tableTime;

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
        <BtnArrow direction={NEXT} onClick={toggleDisplayController} />
      </div>
      <div
        id="table-option-selector__view-time"
        className="flex items-center whitespace-nowrap border-b py-1"
      >
        <Selectbox
          selectedValue={`${(firstHour + '').padStart(2, '0')}`}
          iconSize={8}
        >
          <Selectbox.Options>
            {startHours.map((hour) => (
              <Selectbox.Option
                key={hour}
                onClick={() => changeTableTime('firstHour', hour)}
              >
                {hour}
              </Selectbox.Option>
            ))}
          </Selectbox.Options>
        </Selectbox>
        <Selectbox
          selectedValue={`${(firstMinute + '').padStart(2, '0')}`}
          iconSize={8}
        >
          <Selectbox.Options>
            {startMinutes.map((minute) => (
              <Selectbox.Option
                key={minute}
                onClick={() => changeTableTime('firstMinute', minute)}
              >
                {minute}
              </Selectbox.Option>
            ))}
          </Selectbox.Options>
        </Selectbox>
        ~
        <Selectbox
          selectedValue={`${(lastHour + '').padStart(2, '0')}`}
          iconSize={8}
        >
          <Selectbox.Options>
            {endHours.map((hour) => (
              <Selectbox.Option
                key={hour}
                onClick={() => changeTableTime('lastHour', hour)}
              >
                {hour}
              </Selectbox.Option>
            ))}
          </Selectbox.Options>
        </Selectbox>
        <Selectbox
          selectedValue={`${(lastMinute + '').padStart(2, '0')}`}
          iconSize={8}
        >
          <Selectbox.Options>
            {endMinutes.map((minute) => (
              <Selectbox.Option
                key={minute}
                onClick={() => changeTableTime('lastMinute', minute)}
              >
                {minute}
              </Selectbox.Option>
            ))}
          </Selectbox.Options>
        </Selectbox>
      </div>
      <div
        id="table-option-selector__toggle-visible-state"
        className="flex items-center gap-2 border-b py-1 px-3"
      >
        <MenuButton
          enabled={TableDisplay.value.seeCancel}
          onClick={toggleSeeCancel}
        >
          <FontAwesomeIcon icon={faBan} fontSize={14} />
          취소
        </MenuButton>
        <MenuButton
          enabled={TableDisplay.value.seeNoshow}
          onClick={toggleSeeNoshow}
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
