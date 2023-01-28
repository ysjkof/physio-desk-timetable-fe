import { useNavigate } from 'react-router-dom';

export const useNavCreatePatient = () => {
  const navigate = useNavigate();
  const openCreatePatientModal = () => {
    navigate('', { state: { createPatient: true } });
  };
  return { openCreatePatientModal };
};
