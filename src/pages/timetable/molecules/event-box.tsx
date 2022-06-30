import { useReactiveVar } from "@apollo/client";
import {
  faCancel,
  faCommentSlash,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { EditReservationState } from "../../../components/molecules/edit-reservation-state";
import { ReservationState } from "../../../graphql/generated/graphql";
import { getHHMM } from "../../../libs/timetable-utils";
import { cls } from "../../../libs/utils";
import {
  IListReservation,
  selectedReservationVar,
  viewOptionsVar,
} from "../../../store";
import {
  RESERVE_DETAIL,
  RESERVE_EDIT,
  TABLE_CELL_HEIGHT,
  USER_COLORS,
} from "../../../variables";

interface EventBoxProps {
  userIndex: number;
  inset: string;
  numberOfCell: number;
  event: IListReservation;
}

export function EventBox({
  userIndex,
  inset,
  numberOfCell,
  event,
}: EventBoxProps) {
  const {
    id: reservationId,
    startDate,
    endDate,
    state,
    memo,
    prescriptions,
    patient: { name, registrationNumber },
  } = event;

  const isEdit = useMatch(RESERVE_DETAIL);
  const viewOptions = useReactiveVar(viewOptionsVar);
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);
  const height = numberOfCell * TABLE_CELL_HEIGHT;

  const eventBox = useRef<HTMLDivElement>(null);
  const eventController = useRef<HTMLDivElement>(null);
  const tooltip = useRef<HTMLDivElement>(null);

  const positioningTooltip = () => {
    if (eventBox.current && tooltip.current && eventController.current) {
      const eventBoxTop = eventBox.current.offsetTop;
      const userColEl = eventBox.current.parentElement!;
      const userColHeight = userColEl.clientHeight;
      const userColWidth = userColEl.clientHeight;

      const { right, width, top, bottom } =
        tooltip.current.getBoundingClientRect();

      if (right > userColWidth) {
        tooltip.current.classList.remove("left-[90px]");
        tooltip.current.style.left = -width + "px";
      }
      if (bottom > userColHeight) {
        tooltip.current.classList.remove("top-4");
        tooltip.current.style.bottom = "0";
      }
      console.log("top > userColHeight", top, userColHeight);
      if (eventBoxTop === 0) {
        eventController.current.classList.remove("-top-[1.2rem]");
      }
    }
  };

  useEffect(() => {
    if (isHover) positioningTooltip();
  });

  return (
    <motion.div
      ref={eventBox}
      whileHover={{ zIndex: 31 }}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
      className={cls(
        "EVENT_BOX group absolute z-30 cursor-pointer",
        !viewOptions.seeCancel && state === ReservationState.Canceled
          ? "hidden"
          : !viewOptions.seeNoshow && state === ReservationState.NoShow
          ? "hidden"
          : ""
      )}
      style={{
        inset,
        height,
      }}
    >
      <div
        onClick={() =>
          isEdit ?? navigate(RESERVE_EDIT, { state: { reservationId } })
        }
        className={cls(
          "relative h-full overflow-hidden border px-1",
          state !== ReservationState.Reserved ? "no-reserved" : ""
        )}
        style={{
          ...(state === ReservationState.Reserved && {
            borderColor: USER_COLORS[userIndex]?.deep,
            backgroundColor: USER_COLORS[userIndex]?.light,
          }),
        }}
      >
        <div className="flex h-5 items-center justify-between overflow-hidden whitespace-nowrap text-center">
          {state === ReservationState.Reserved ? null : state ===
            ReservationState.Canceled ? (
            <FontAwesomeIcon icon={faCancel} className="cancel" />
          ) : (
            <FontAwesomeIcon icon={faCommentSlash} className="noshow" />
          )}
          <span className="ml-0.5 w-full font-extralight">
            {registrationNumber}:{name}
          </span>
          {memo && (
            <div className="absolute right-0 top-0 border-4 border-t-red-500 border-r-red-500 border-l-transparent border-b-transparent" />
          )}
        </div>
        {prescriptions && numberOfCell !== 1 && (
          <div className="h-5 overflow-hidden text-ellipsis whitespace-nowrap text-center">
            {prescriptions.map((prescription) => prescription.name + " ")}
          </div>
        )}
        {
          numberOfCell > 2 ? (
            memo ? (
              <div
                className="overflow-hidden break-all font-extralight leading-5"
                style={{ height: (numberOfCell - 2) * TABLE_CELL_HEIGHT }}
              >
                {memo}
              </div>
            ) : null
          ) : null // 칸이 없어서 메모 생략
        }
      </div>
      {isHover && (
        <>
          <motion.div
            ref={eventController}
            initial={{ width: 0 }}
            animate={{
              width: "100%",
              transition: { bounce: "twin", duration: 0.2 },
            }}
            className="absolute left-0 -top-[1.2rem] flex items-baseline justify-between overflow-hidden bg-gray-100 px-2 pb-[0.2rem] text-gray-800"
          >
            <FontAwesomeIcon
              icon={faCopy}
              fontSize={16}
              className="text-green-500 hover:scale-125"
              onClick={() => selectedReservationVar(event)}
            />
            <EditReservationState reservation={event} />
          </motion.div>

          <div
            ref={tooltip}
            className={cls(
              "tooltip absolute top-4 left-[90px] w-[150px] rounded border p-1 shadow-cst",
              state !== ReservationState.Reserved ? "no-reserved" : ""
            )}
            style={{
              ...(state === ReservationState.Reserved && {
                borderColor: USER_COLORS[userIndex]?.deep,
                backgroundColor: USER_COLORS[userIndex]?.light,
              }),
            }}
          >
            <span className="mb-1 flex">
              예약시간 : {getHHMM(startDate, ":")} ~ {getHHMM(endDate, ":")}
            </span>
            <ul className="mb-1 flex flex-col">
              처방 :
              {prescriptions?.map((prescription, i) => (
                <li key={i} className="flex pl-2">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {prescription.name}
                  </span>
                </li>
              ))}
            </ul>
            {event.memo && (
              <div className="flex flex-col pt-1">메모 : {event.memo}</div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
