import { UserPlus } from '../../../../svgs';
import { MenuButton } from '../../../../components';
import { useNavCreatePatient } from '../../../../hooks';

const CreatePatientButton = () => {
  const { openCreatePatientModal } = useNavCreatePatient();

  return (
    <MenuButton
      onClick={openCreatePatientModal}
      className="bg-cst-blue text-white"
    >
      <UserPlus />
      환자 등록하기
    </MenuButton>
  );
};

export default CreatePatientButton;
