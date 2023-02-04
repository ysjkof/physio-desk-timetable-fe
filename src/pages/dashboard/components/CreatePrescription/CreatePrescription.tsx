import { Modal } from '../../../../components';
import FormForCreatePrescription from './FormForCreatePrescription';
import type { CloseAction } from '../../../../types/props.types';

const CreatePrescription = ({ closeAction }: CloseAction) => {
  return (
    <Modal closeAction={closeAction}>
      <div className="w-96 rounded-sm border">
        <h1 className="modal-header">처방 만들기</h1>
        <FormForCreatePrescription closeAction={closeAction} />
      </div>
    </Modal>
  );
};

export default CreatePrescription;
