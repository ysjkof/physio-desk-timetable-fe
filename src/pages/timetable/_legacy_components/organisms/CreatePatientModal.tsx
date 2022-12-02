import ModalContentsLayout from '../../../../_legacy_components/templates/ModalContentsLayout';
import ModalTemplate from '../../../../_legacy_components/templates/ModalTemplate';
import CreatePatientForm from '../molecules/CreatePatientForm';
import type { CloseAction } from '../../../../types/props.types';

export default function CreatePatientModal({ closeAction }: CloseAction) {
  return (
    <ModalTemplate closeAction={closeAction}>
      {' '}
      <ModalContentsLayout title="환자등록" closeAction={closeAction}>
        <CreatePatientForm closeAction={closeAction} />
      </ModalContentsLayout>
    </ModalTemplate>
  );
}
