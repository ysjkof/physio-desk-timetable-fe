import { useNavigate } from 'react-router-dom';
import { resetStore } from '../store';
import { localStorageUtils } from '../utils/localStorage.utils';

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorageUtils.remove({ key: 'token' });
    resetStore();
    navigate('/');
  };

  return logout;
};
