import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const CreatePrescriptionButton = () => {
  const createPrescription = () => {};

  return (
    <Link
      to="create"
      type="button"
      className="css_default-button rounded-md bg-[#26C06D] text-sm text-white"
      onClick={createPrescription}
    >
      <FontAwesomeIcon
        icon={faPlus}
        className="rounded-full border p-0.5"
        size="xs"
      />
      처방 만들기
    </Link>
  );
};

export default CreatePrescriptionButton;
