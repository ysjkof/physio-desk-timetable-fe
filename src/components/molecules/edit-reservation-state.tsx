import { RESERVATION_STATE_KOR } from "../../variables";
import { IListReservation } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRegistered } from "@fortawesome/free-regular-svg-icons";
import { faBan, faCommentSlash } from "@fortawesome/free-solid-svg-icons";
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
        icon={faRegistered}
        fontSize={14}
        onClick={() => onClickEditReserve(ReservationState.Reserved)}
        className={cls(
          "cursor-pointer rounded-full bg-white hover:scale-125 hover:opacity-100",
          reservation.state === ReservationState.Reserved
            ? "text-lg"
            : "opacity-50"
        )}
      />
      <FontAwesomeIcon
        icon={faBan}
        fontSize={14}
        onClick={() => onClickEditReserve(ReservationState.Canceled)}
        className={cls(
          "cursor-pointer rounded-full bg-white hover:scale-125 hover:text-yellow-600",
          reservation.state === ReservationState.Canceled
            ? "text-lg text-yellow-600"
            : "opacity-50"
        )}
      />
      <FontAwesomeIcon
        icon={faCommentSlash}
        fontSize={14}
        onClick={() => onClickEditReserve(ReservationState.NoShow)}
        className={cls(
          "cursor-pointer rounded-full bg-white hover:scale-125 hover:text-red-400",
          reservation.state === ReservationState.NoShow
            ? "text-lg text-red-400"
            : "opacity-50"
        )}
      />
    </>
  );
};
