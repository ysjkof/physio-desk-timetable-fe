import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faBan, faCommentSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, Variants } from 'framer-motion';
import { MenuButton } from '../../../components/molecules/MenuButton';
import { cls, setLocalStorage } from '../../../utils/utils';
import { loggedInUserVar } from '../../../store';
import { NEXT } from '../../../constants/constants';
import { BtnArrow } from '../../../components/atoms/ButtonArrow';
import useStore from '../../../hooks/useStore';
import { useReactiveVar } from '@apollo/client';

export function TableOptionSelector() {
  const {
    setSelectedInfo,
    viewOptions,
    clinicLists,
    clinicListsVar,
    selectedInfo,
  } = useStore();

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
    setLocalStorage({
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
          setLocalStorage({
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
      const newViewOptions = {
        ...viewOptions.get,
        seeActiveOption: !viewOptions.get.seeActiveOption,
      };
      viewOptions.set(newViewOptions);
    }
  };

  const invokeSaveViewOptions = (value: any) => {
    if (!loggedInUser) throw new Error('로그인 유저 정보가 없습니다');
    viewOptions.set(value);
    setLocalStorage({
      key: 'viewOption',
      userId: loggedInUser.id,
      userName: loggedInUser.name,
      value,
    });
  };
  const variants: Variants = {
    init: { x: 300 },
    end: { x: 0, transition: { duration: 0.3 } },
    exit: { x: 300, transition: { duration: 0.3 } },
  };

  return selectedInfo.clinic ? (
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
          enabled={viewOptions.get.seeCancel}
          label={'취소'}
          onClick={() => {
            const newViewOptions = {
              ...viewOptions.get,
              seeCancel: !viewOptions.get.seeCancel,
            };
            invokeSaveViewOptions(newViewOptions);
          }}
        />
        <MenuButton
          icon={<FontAwesomeIcon icon={faCommentSlash} fontSize={14} />}
          enabled={viewOptions.get.seeNoshow}
          label={'부도'}
          onClick={() => {
            const newViewOptions = {
              ...viewOptions.get,
              seeNoshow: !viewOptions.get.seeNoshow,
            };
            invokeSaveViewOptions(newViewOptions);
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
                enabled={clinic.id === selectedInfo.clinic?.id}
                isWidthFull
                icon={
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    fontSize={16}
                    className={`${
                      clinic.id === selectedInfo.clinic?.id
                        ? 'text-green-500'
                        : ''
                    }`}
                  />
                }
                onClick={() => onClickChangeSelectClinic(clinic.id)}
              />
              <ul
                className={cls(
                  'USER_OF_CLINIC pl-6',
                  clinic.id === selectedInfo.clinic?.id
                    ? ''
                    : 'pointer-events-none'
                )}
              >
                {clinic.members
                  .sort((a, b) => {
                    if (a.user.name > b.user.name) return 1;
                    if (a.user.name < b.user.name) return -1;
                    return 0;
                  })
                  .map(
                    (member, i) =>
                      member.staying && (
                        <MenuButton
                          key={i}
                          label={member.user.name}
                          isWidthFull
                          enabled={
                            clinic.id === selectedInfo.clinic?.id &&
                            member.isActivate
                          }
                          icon={
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              fontSize={16}
                              className={`${
                                clinic.id === selectedInfo.clinic?.id &&
                                member.isActivate
                                  ? 'text-green-500'
                                  : ''
                              }`}
                            />
                          }
                          onClick={() =>
                            onClickToggleUser(clinic.id, member.id)
                          }
                        />
                      )
                  )}
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
