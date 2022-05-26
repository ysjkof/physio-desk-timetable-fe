import { useReactiveVar } from "@apollo/client";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
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

  if (!loggedInUser || !viewOptions) return <></>;
  return (
    <div className="flex w-full items-center justify-end space-x-3">
      <div className="group-view-controller relative">
        <div
          className="flex cursor-pointer items-center gap-1"
          onClick={() =>
            !viewOptions.seeActiveOption && onClickChangeSeeActiveOption()
          }
        >
          <span>보기설정</span>
          <FontAwesomeIcon icon={faGear} fontSize="medium" />
        </div>
        <AnimatePresence>
          {viewOptions.seeActiveOption && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="fixed top-0 left-0 z-[100] h-screen w-screen bg-black/50 opacity-0"
            >
              <div
                className="modal-background absolute h-full w-full"
                onClick={() =>
                  viewOptions.seeActiveOption && onClickChangeSeeActiveOption()
                }
              />
              {viewOptions.seeActiveOption && (
                <div className="absolute top-6 z-50 h-96 w-60 rounded-md bg-white p-4 shadow-cst">
                  <div className="mb-2 flex justify-between border-b pb-2">
                    <div className="w-full"></div>
                    <div className="flex w-14 whitespace-nowrap">
                      <div className="group relative w-full space-x-1 text-center">
                        <span>보기</span>
                        <span className="rounded-full border border-gray-400 px-1">
                          ?
                        </span>
                        <p className="bubble-arrow-t-center absolute top-7 right-1/2 hidden w-48 translate-x-1/2 rounded-md bg-black p-4 text-white group-hover:block">
                          시간표에 표시할 병원이나 사용자를 선택합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                  <ul className="h-full  overflow-y-scroll">
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
                              clinic.id === selectedClinic.id
                                ? ""
                                : "pointer-events-none"
                            )}
                          >
                            {clinic.members.map((member, i) => (
                              <ButtonCheck
                                key={i}
                                isActivated={clinic.id === selectedClinic.id}
                                isMemberActivated={member.activation}
                                name={member.user.name}
                                onClickFx={() =>
                                  onClickToggleUser(clinic.id, member.id)
                                }
                              />
                            ))}
                          </ul>
                          <div className="seperate-bar"></div>
                        </Fragment>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
