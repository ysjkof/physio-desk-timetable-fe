import { ModalContentsLayout } from "../templates/modal-contents-layout";
import { TimetableModalProps } from "../../pages/timetable";
import { ModalTemplate } from "../molecules/modal-template";
import { CreatePatientForm } from "../molecules/create-patient-form";

export const CreatePatient = ({ closeAction }: TimetableModalProps) => {
  return (
    <ModalTemplate
      closeAction={closeAction}
      children={
        <ModalContentsLayout
          title="환자등록"
          closeAction={closeAction}
          children={
            <CreatePatientForm closeAction={closeAction} refetch={() => null} />
          }
        />
      }
    />
  );
};
