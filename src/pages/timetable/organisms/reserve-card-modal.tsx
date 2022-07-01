import { SearchPatient } from "../../../components/organisms/search-patient";
import { TimetableModalProps } from "..";
import { ModalContentsLayout } from "../../../components/templates/modal-contents-layout";
import { ReserveForm } from "../molecules/reserve-form";
import { ModalTemplate } from "../../../components/molecules/modal-template";
import { useLocation } from "react-router-dom";

export const ReserveCardModal = ({ closeAction }: TimetableModalProps) => {
  const location = useLocation();

  const state = location.state as {
    startDate: Date;
    member: { id: number; name: string };
    isDayOff?: boolean;
  };
  const startDate = state?.startDate;
  const member = state?.member;
  const isDayOff = state?.isDayOff;

  return (
    <ModalTemplate
      closeAction={closeAction}
      children={
        <ModalContentsLayout
          title={isDayOff ? "예약잠금" : "예약하기"}
          closeAction={closeAction}
          children={
            <>
              {!isDayOff && <SearchPatient />}
              <ReserveForm
                closeAction={closeAction}
                startDate={startDate}
                member={member}
                isDayoff={isDayOff}
              />
            </>
          }
        />
      }
    />
  );
};
