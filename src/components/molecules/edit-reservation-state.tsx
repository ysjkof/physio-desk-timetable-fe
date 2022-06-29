import { RESERVATION_STATE_KOR } from "../../variables";
import { IListReservation } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faBan,
  faCommentSlash,
} from "@fortawesome/free-solid-svg-icons";
import { cls } from "../../libs/utils";
import {
  ReservationState,
  useEditReservationMutation,
} from "../../graphql/generated/graphql";

interface EditReservationStateProps {
  reservation: IListReservation;
  redirect?: () => void;
}

export const EditReservationState = ({
  reservation,
  redirect,
}: EditReservationStateProps) => {
  const [editReservationMutation] = useEditReservationMutation({
    update(cache) {
      if (!reservation) return console.error("reservation이 없습니다");
      const myReserv = cache.identify(reservation);
      cache.modify({
        id: myReserv,
        fields: {
          state() {},
        },
      });
    },
  });

  const onClickEditReserve = (state: ReservationState) => {
    const confirmDelete = window.confirm(
      `예약 상태를 ${RESERVATION_STATE_KOR[state]}(으)로 변경합니다.`
    );
    if (confirmDelete) {
      editReservationMutation({
        variables: {
          input: {
            reservationId: reservation.id,
            state,
          },
        },
      });
    }
  };

  return (
    <>
      <FontAwesomeIcon
        icon={faBan}
        fontSize={14}
        onClick={() => onClickEditReserve(ReservationState.Canceled)}
        className={cls(
          "cursor-pointer rounded-full hover:scale-125 hover:text-red-500",
          reservation.state === ReservationState.Canceled
            ? "pointer-events-none text-red-500"
            : "text-gray-400"
        )}
      />
      <FontAwesomeIcon
        icon={faCommentSlash}
        fontSize={14}
        onClick={() => onClickEditReserve(ReservationState.NoShow)}
        className={cls(
          "cursor-pointer rounded-full hover:scale-125 hover:text-black",
          reservation.state === ReservationState.NoShow
            ? "pointer-events-none text-black"
            : "text-gray-400"
        )}
      />
      <FontAwesomeIcon
        icon={faArrowRotateLeft}
        fontSize={14}
        onClick={() => onClickEditReserve(ReservationState.Reserved)}
        className={cls(
          "cursor-pointer rounded-full",
          reservation.state === ReservationState.Reserved
            ? "pointer-events-none text-gray-400"
            : "text-blue-800 hover:scale-125"
        )}
      />
    </>
  );
};
