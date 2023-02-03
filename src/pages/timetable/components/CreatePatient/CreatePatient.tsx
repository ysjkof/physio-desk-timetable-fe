import { Modal } from '../../../../components';
import { useCloseModal } from '../../../../hooks';
import { FormForCreatePatient } from '../FormForCreatePatient';

const CreatePatient = () => {
  const closeModal = useCloseModal();

  return (
    <Modal closeAction={closeModal}>
      <div className="w-96 rounded-sm border">
        <h1 className="modal-header">환자 등록</h1>
        <FormForCreatePatient closeAction={closeModal} />
      </div>
    </Modal>
  );
};

export default CreatePatient;
