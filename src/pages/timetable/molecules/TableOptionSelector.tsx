import { useReactiveVar } from '@apollo/client';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faBan, faCommentSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, Variants } from 'framer-motion';
import { MenuButton } from '../../../components/molecules/MenuButton';
import {
  cls,
  saveClinicLists,
  saveSelectedClinic,
  saveViewOptions,
} from '../../../utils/utils';
import {
  clinicListsVar,
  loggedInUserVar,
  selectedClinicVar,
  viewOptionsVar,
} from '../../../store';
import { NEXT } from '../../../constants/constants';
import { BtnArrow } from '../../../components/atoms/ButtonArrow';

export function TableOptionSelector() {
  const viewOptions = useReactiveVar(viewOptionsVar);
  const clinicLists = useReactiveVar(clinicListsVar);
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const loggedInUser = useReactiveVar(loggedInUserVar);

  if (!loggedInUser || !viewOptions) return <></>;

  const onClickToggleUser = (clinicId: number, memberId: number) => {
    if (!loggedInUser) return console.warn('❌ loggedInUser가 false입니다');
    const gIndex = clinicLists.findIndex(
      (prevClinic) => prevClinic.id === clinicId
    );
    if (gIndex === -1) return console.warn('❌ group index가 -1입니다');
    const mIndex = clinicLists[gIndex].members.findIndex(
      (prevMember) => prevMember.id === memberId
    );
    if (mIndex === -1) return console.warn('❌ member index가 -1입니다');

    const activateLength = clinicLists[gIndex].members.filter(
      (member) => member.isActivate
    ).length;
    let isActivate = clinicLists[gIndex].members[mIndex].isActivate;

    if (isActivate && activateLength === 1) {
      return;
    }
    clinicLists[gIndex].members[mIndex].isActivate = !isActivate;
    saveClinicLists([...clinicLists], loggedInUser.id);
  };

  const onClickChangeSelectClinic = (id: number, name: string) => {
    if (!loggedInUser) return console.warn('❌ loggedInUser가 false입니다');
    if (selectedClinic?.id !== id) {
      const clinic = clinicLists.find((clinic) => clinic.id === id);
      const me = loggedInUser.members?.find(
        (member) => member.clinic.id === id
      );
      if (clinic && me) {
        const newSelectedClinic = {
          id,
          name: clinic.name,
          type: clinic.type,
          isManager: me.manager,
          isStayed: me.staying,
          members: clinic.members,
        };
        saveSelectedClinic(newSelectedClinic, loggedInUser.id);
      }
    }
  };

  const onClickChangeSeeActiveOption = () => {
    if (viewOptions) {
      const newViewOptions = {
        ...viewOptions,
        seeActiveOption: !viewOptions.seeActiveOption,
      };
      viewOptionsVar(newViewOptions);
    }
  };

  const variants: Variants = {
    init: { x: 300 },
    end: { x: 0, transition: { duration: 0.3 } },
    exit: { x: 300, transition: { duration: 0.3 } },
  };

  return selectedClinic ? (
    <motion.div
      variants={variants}
      initial="init"
      animate="end"
      exit="exit"
      className="USER_VIEW_CONTROLLER absolute top-6 z-[35] w-[240px] rounded-md border border-gray-400 bg-white py-2 shadow-cst"
    >
      <div className="HEADER flex items-center justify-between border-b px-3 pb-1">
        <span className="group relative z-40 px-1 after:ml-1 after:rounded-full after:border after:px-1 after:content-['?']">
          보기설정
          <p className="bubble-arrow-t-right absolute top-7 right-0 hidden w-48 rounded-md bg-black p-4 text-white group-hover:block">
            시간표에 표시할 병원이나 사용자를 선택합니다.
          </p>
        </span>
        <BtnArrow direction={NEXT} onClick={onClickChangeSeeActiveOption} />
      </div>

      <div className="flex items-center gap-2 border-b py-1 px-3">
        <MenuButton
          icon={<FontAwesomeIcon icon={faBan} fontSize={14} />}
          enabled={viewOptions.seeCancel}
          label={'취소'}
          onClick={() => {
            const newViewOptions = {
              ...viewOptions,
              seeCancel: !viewOptions.seeCancel,
            };
            saveViewOptions(newViewOptions, loggedInUser.id);
          }}
        />
        <MenuButton
          icon={<FontAwesomeIcon icon={faCommentSlash} fontSize={14} />}
          enabled={viewOptions.seeNoshow}
          label={'부도'}
          onClick={() => {
            const newViewOptions = {
              ...viewOptions,
              seeNoshow: !viewOptions.seeNoshow,
            };
            saveViewOptions(newViewOptions, loggedInUser.id);
          }}
        />
      </div>
      <ul className="BODY divide- h-full space-y-1 divide-y overflow-y-scroll px-3">
        {clinicLists === null || clinicLists.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            소속된 병원이 없습니다.
          </div>
        ) : (
          clinicLists.map((clinic, i) => (
            <div key={i} className="CLINIC pt-2">
              <MenuButton
                label={clinic.name}
                enabled={clinic.id === selectedClinic.id}
                isWidthFull
                icon={
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    fontSize={16}
                    className={`${
                      clinic.id === selectedClinic.id ? 'text-green-500' : ''
                    }`}
                  />
                }
                onClick={() =>
                  onClickChangeSelectClinic(clinic.id, clinic.name)
                }
              />
              <ul
                className={cls(
                  'USER_OF_CLINIC pl-6',
                  clinic.id === selectedClinic.id ? '' : 'pointer-events-none'
                )}
              >
                {clinic.members
                  .sort((a, b) => {
                    if (a.user.name > b.user.name) return 1;
                    if (a.user.name < b.user.name) return -1;
                    return 0;
                  })
                  .map((member, i) => (
                    <MenuButton
                      key={i}
                      label={member.user.name}
                      isWidthFull
                      enabled={
                        clinic.id === selectedClinic.id && member.isActivate
                      }
                      icon={
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          fontSize={16}
                          className={`${
                            clinic.id === selectedClinic.id && member.isActivate
                              ? 'text-green-500'
                              : ''
                          }`}
                        />
                      }
                      onClick={() => onClickToggleUser(clinic.id, member.id)}
                    />
                  ))}
              </ul>
            </div>
          ))
        )}
      </ul>
    </motion.div>
  ) : (
    <></>
  );
}
