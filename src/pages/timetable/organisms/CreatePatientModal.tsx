import { ModalContentsLayout } from '../../../components/templates/ModalContentsLayout';
import { TimetableModalProps } from '..';
import { ModalTemplate } from '../../../components/molecules/ModalTemplate';
import { CreatePatientForm } from '../../../components/molecules/CreatePatientForm';

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
