import { Modal } from '../../../../components';
import FormForEditPrescription from './FormForEditPrescription';
import type { CloseAction } from '../../../../types/props.types';

const EditPrescription = ({ closeAction }: CloseAction) => {
  return (
    <Modal closeAction={closeAction}>
      <div className="w-96 rounded-sm border">
        <h1 className="modal-header">처방 수정</h1>
        <FormForEditPrescription closeAction={closeAction} />
      </div>
    </Modal>
  );
};

export default EditPrescription;
