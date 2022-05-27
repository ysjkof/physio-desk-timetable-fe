import { useReactiveVar } from "@apollo/client";
import { motion, Variants } from "framer-motion";
import { Fragment } from "react";
import { cls } from "../../../libs/utils";
import {
  clinicListsVar,
  loggedInUserVar,
  selectedClinicVar,
  viewOptionsVar,
} from "../../../store";
import {
  LOCALSTORAGE_SELECTED_CLINIC,
  LOCALSTORAGE_VIEW_OPTION_CLINICS,
} from "../../../variables";
import { BtnArrow } from "./button-arrow";
import { ButtonCheck } from "./button-check";

interface TableClinicSelectorProps {}

export function TableClinicSelector({}: TableClinicSelectorProps) {
  const viewOptions = useReactiveVar(viewOptionsVar);
  const clinicLists = useReactiveVar(clinicListsVar);
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const loggedInUser = useReactiveVar(loggedInUserVar);

  const onClickToggleUser = (clinicId: number, memberId: number) => {
    if (!loggedInUser) return console.warn("❌ loggedInUser가 false입니다");
    const gIndex = clinicLists.findIndex(
      (prevClinic) => prevClinic.id === clinicId
    );
    if (gIndex === -1) return console.warn("❌ group index가 -1입니다");
    const mIndex = clinicLists[gIndex].members.findIndex(
      (prevMember) => prevMember.id === memberId
    );
    if (mIndex === -1) return console.warn("❌ member index가 -1입니다");

    const activateLength = clinicLists[gIndex].members.filter(
      (member) => member.activation
    ).length;
    let isActivate = clinicLists[gIndex].members[mIndex].activation;

    if (isActivate && activateLength === 1) {
      return;
    }
    clinicLists[gIndex].members[mIndex].activation = !isActivate;
    localStorage.setItem(
      LOCALSTORAGE_VIEW_OPTION_CLINICS + loggedInUser.id,
      JSON.stringify(clinicLists)
    );
    clinicListsVar([...clinicLists]);
  };

  const onClickChangeSelectClinic = (id: number, name: string) => {
    if (!loggedInUser) return console.warn("❌ loggedInUser가 false입니다");
    let newSelectedClinic = selectedClinic;
    if (selectedClinic.id === id) {
      newSelectedClinic = {
        id: 0,
        name: "",
      };
    } else {
      newSelectedClinic = {
        id,
        name,
      };
    }
    localStorage.setItem(
      LOCALSTORAGE_SELECTED_CLINIC + loggedInUser.id,
      JSON.stringify(newSelectedClinic)
    );
    selectedClinicVar(newSelectedClinic);
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
    end: { x: 0, transition: { duration: 0.5 } },
    exit: { x: 300, transition: { duration: 0.5 } },
  };

  if (!loggedInUser || !viewOptions) return <></>;
  return (
    <motion.div
      variants={variants}
      initial="init"
      animate="end"
      exit="exit"
      className="group-view-controller absolute right-0 z-[100] h-full w-[240px] bg-white pl-4"
    >
      <div className="view-controller-header mb-2 flex justify-between border-b px-3 pb-2">
        <span className="group relative px-1 after:ml-1 after:rounded-full after:border after:border-gray-400 after:px-1 after:content-['?']">
          보기
          <p className="bubble-arrow-t-right absolute top-7 right-0 hidden w-48 rounded-md bg-black p-4 text-white group-hover:block">
            시간표에 표시할 병원이나 사용자를 선택합니다.
          </p>
        </span>
        <BtnArrow direction="after" onClick={onClickChangeSeeActiveOption} />
      </div>
      <ul className="h-full overflow-y-scroll">
        {clinicLists === null || clinicLists.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            소속된 병원이 없습니다.
          </div>
        ) : (
          clinicLists.map((clinic, i) => (
            <Fragment key={i}>
              <ButtonCheck
                name={clinic.name}
                isActivated={clinic.id === selectedClinic.id}
                onClickFx={() =>
                  onClickChangeSelectClinic(clinic.id, clinic.name)
                }
              />
              <ul
                className={cls(
                  clinic.id === selectedClinic.id ? "" : "pointer-events-none"
                )}
              >
                {clinic.members.map((member, i) => (
                  <ButtonCheck
                    key={i}
                    isActivated={clinic.id === selectedClinic.id}
                    isMemberActivated={member.activation}
                    name={member.user.name}
                    onClickFx={() => onClickToggleUser(clinic.id, member.id)}
                  />
                ))}
              </ul>
              <div className="seperate-bar"></div>
            </Fragment>
          ))
        )}
      </ul>
    </motion.div>
  );
}
