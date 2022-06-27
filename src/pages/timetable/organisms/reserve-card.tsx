import { SearchPatient } from "../../../components/organisms/search-patient";
import { TimetableModalProps } from "..";
import { ModalContentsLayout } from "../../../components/templates/modal-contents-layout";
import { ReserveForm } from "../molecules/reserve-form";
import { ModalTemplate } from "../../../components/molecules/modal-template";
import { useLocation, useNavigate } from "react-router-dom";
import { TIMETABLE } from "../../../variables";

export const ReserveCard = ({ closeAction, refetch }: TimetableModalProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as {
    startDate: Date;
    member: { id: number; name: string };
  };
  let startDate = state?.startDate;
  let member = state?.member;

  if (!startDate || !member) navigate(TIMETABLE);
  return (
    <ModalTemplate
      closeAction={closeAction}
      children={
        <ModalContentsLayout
          title="예약하기"
          closeAction={closeAction}
          children={
            <>
              <SearchPatient />
              <ReserveForm
                closeAction={closeAction}
                refetch={refetch}
                startDate={startDate}
                member={member}
              />
            </>
          }
        />
      }
    />
  );
};
