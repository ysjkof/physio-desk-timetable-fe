import { ModalContentsLayout } from './ModalContentsLayout';
import { TimetableModalProps } from '../../pages/timetable';
import { ModalTemplate } from '../molecules/ModalTemplate';
import { CreatePatientForm } from '../molecules/CreatePatientForm';

export const CreatePatientModal = ({ closeAction }: TimetableModalProps) => {
  return (
    <ModalTemplate
      closeAction={closeAction}
      children={
        <ModalContentsLayout
          title="환자등록"
          closeAction={closeAction}
          children={<CreatePatientForm closeAction={closeAction} />}
        />
      }
    />
  );
};
