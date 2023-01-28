import { useNavigate } from 'react-router-dom';

export const useCloseModal = () => {
  const navigate = useNavigate();
  const closeModal = () => {
    navigate('', { state: null });
  };
  return closeModal;
};
