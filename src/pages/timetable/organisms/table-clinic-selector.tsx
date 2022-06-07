import { useReactiveVar } from "@apollo/client";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, Variants } from "framer-motion";
import { Fragment } from "react";
import { BtnMenu } from "../../../components/button-menu";
import {
  clinicListsVar,
  loggedInUserVar,
  selectedClinicVar,
  viewOptionsVar,
} from "../../../store";
import {
  LOCALSTORAGE_SELECTED_CLINIC,
  LOCALSTORAGE_VIEW_OPTION_CLINICS,
  NEXT,
} from "../../../variables";
import { BtnArrow } from "../molecules/button-arrow";

export function TableClinicSelector() {
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
    end: { x: 0, transition: { duration: 0.3 } },
    exit: { x: 300, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={variants}
      initial="init"
      animate="end"
      exit="exit"
      className="group-view-controller w-[240px] border bg-white pt-2 shadow-inner"
    >
      <div className="view-controller-header mb-2 flex items-center justify-between border-b px-3 pb-1">
        <span className="group relative px-1 after:ml-1 after:rounded-full after:border after:px-1 after:content-['?']">
          보기설정
          <p className="bubble-arrow-t-right absolute top-7 right-0 z-40 hidden w-48 rounded-md bg-black p-4 text-white group-hover:block">
            시간표에 표시할 병원이나 사용자를 선택합니다.
          </p>
        </span>
        <BtnArrow direction={NEXT} onClick={onClickChangeSeeActiveOption} />
      </div>
      <ul className="view-controller-body h-full space-y-1 overflow-y-scroll px-3">
        {clinicLists === null || clinicLists.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            소속된 병원이 없습니다.
          </div>
        ) : (
          clinicLists.map((clinic, i) => (
            <Fragment key={i}>
              <BtnMenu
                label={clinic.name}
                enabled={clinic.id === selectedClinic.id}
                isWidthFull
                icon={
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    fontSize={16}
                    className={`${
                      clinic.id === selectedClinic.id ? "text-green-500" : ""
                    }`}
                  />
                }
                onClick={() =>
                  onClickChangeSelectClinic(clinic.id, clinic.name)
                }
              />
              <ul
                className={`pl-6 ${
                  clinic.id === selectedClinic.id ? "" : "pointer-events-none"
                }`}
              >
                {clinic.members.map((member, i) => (
                  <BtnMenu
                    key={i}
                    label={member.user.name}
                    isWidthFull
                    enabled={
                      clinic.id === selectedClinic.id && member.activation
                    }
                    icon={
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        fontSize={16}
                        className={`${
                          clinic.id === selectedClinic.id && member.activation
                            ? "text-green-500"
                            : ""
                        }`}
                      />
                    }
                    onClick={() => onClickToggleUser(clinic.id, member.id)}
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