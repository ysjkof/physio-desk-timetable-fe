import { faBan, faCommentSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, Variants } from 'framer-motion';
import {
  cls,
  getMemberState,
  isStayMember,
  renameUseSplit,
} from '../../../utils/common.utils';
import {
  selectClinicId,
  toggleSettingOfTimetable,
  toggleShowCancelOfTimetable,
  toggleShowNoshowOfTimetable,
  useStore,
} from '../../../store';
import { NEXT } from '../../../constants/constants';
import { Selectbox } from '../../../components';
import { getHoursByUnit, getMinutesByUnit } from '../../../utils/date.utils';
import MenuButton from '../../../_legacy_components/molecules/MenuButton';
import BtnArrow from '../../../_legacy_components/atoms/ButtonArrow';
import StateBadge from '../../../_legacy_components/atoms/StateBadge';
import Sidebar from '../../../_legacy_components/molecules/Sidebar';
import { Check } from '../../../svgs';
import { TableTime } from '../../../models';
import { useSelectedClinic, useTableTime } from '../hooks';
import { useFindMyClinics, useMe } from '../../../hooks';
import type {
  FirstAndLastTime,
  MemberOfClient,
} from '../../../types/common.types';

export default function TableOptionSelector() {
  const [meData] = useMe();
  const clinicId = useStore((state) => state.selectedClinicId);
  const showCancelOfTimetable = useStore(
    (state) => state.showCancelOfTimetable
  );
  const showNoshowOfTimetable = useStore(
    (state) => state.showNoshowOfTimetable
  );

  const [myClinics] = useFindMyClinics();
  const { toggleUser } = useSelectedClinic();

  const { changeTableTIme } = useTableTime();

  const closeOptionSelector = () => {
    toggleSettingOfTimetable(false);
  };
  const onClickToggleUser = (memberId: number) => {
    toggleUser(memberId);
  };

  const onClickChangeSelectClinic = (clinicId: number) => {
    if (!meData)
      throw new Error(
        '[onClickChangeSelectClinic] 여기서 meData가 없으면 안됩니다.'
      );
    selectClinicId({ clinicId, userId: meData.id, userName: meData.name });
  };

  const toggleShowCancel = () => {
    toggleShowCancelOfTimetable();
  };
  const toggleShowNoshow = () => {
    toggleShowNoshowOfTimetable();
  };

  const changeTableTime = (key: keyof FirstAndLastTime, value: number) => {
    changeTableTIme(key, value);
  };

  const { lastHour, lastMinute, firstHour, firstMinute } = TableTime.get();

  const startHours = getHoursByUnit(0, 24);
  const endHours = startHours.filter((hour) => hour > firstHour);
  const startMinutes = getMinutesByUnit(10);
  const endMinutes = startMinutes;

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
        <BtnArrow direction={NEXT} onClick={closeOptionSelector} />
      </div>
      <div
        id="table-option-selector__view-time"
        className="flex items-center whitespace-nowrap border-b py-1"
      >
        <Selectbox
          selectedValue={`${String(firstHour).padStart(2, '0')}`}
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
          selectedValue={`${String(firstMinute).padStart(2, '0')}`}
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
          selectedValue={`${String(lastHour).padStart(2, '0')}`}
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
          selectedValue={`${String(lastMinute).padStart(2, '0')}`}
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
        <MenuButton enabled={showCancelOfTimetable} onClick={toggleShowCancel}>
          <FontAwesomeIcon icon={faBan} fontSize={14} />
          취소
        </MenuButton>
        <MenuButton enabled={showNoshowOfTimetable} onClick={toggleShowNoshow}>
          <FontAwesomeIcon icon={faCommentSlash} fontSize={14} />
          부도
        </MenuButton>
      </div>
      <Sidebar noGap className="divide-y">
        {meData &&
          myClinics?.map((clinic) => {
            const meMember = clinic.members.find(
              (member) => member.user.id === meData.id
            );
            if (!meMember) return null;

            const isSelectedClinic = clinic.id === clinicId;

            const { staying, accepted, manager } = meMember;
            const memberState = getMemberState({ staying, accepted, manager });
            const isStay = isStayMember(memberState);

            const sortMember = (members: MemberOfClient[]) => {
              const updated = [...members];
              return updated.sort((a, b) => {
                if (a.user.name > b.user.name) return 1;
                if (a.user.name < b.user.name) return -1;
                return 0;
              });
            };

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
                        onClick={() => onClickToggleUser(member.id)}
                        selected={isSelectedClinic && member.canSee}
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
