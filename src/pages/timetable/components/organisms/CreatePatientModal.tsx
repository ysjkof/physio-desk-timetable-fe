import { TimetableModalProps } from '../../Timetable';
import ModalContentsLayout from '../../../../components/templates/ModalContentsLayout';
import ModalTemplate from '../../../../components/templates/ModalTemplate';
import CreatePatientForm from '../molecules/CreatePatientForm';

export default function CreatePatientModal({
  closeAction,
}: TimetableModalProps) {
  return (
    <ModalTemplate
      closeAction={closeAction}
      children={
        <ModalContentsLayout title="환자등록" closeAction={closeAction}>
          <CreatePatientForm closeAction={closeAction} />
        </ModalContentsLayout>
      }
    />
  );
}
