import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import localStorageUtils from '../utils/localStorage.utils';

export const useLogout = () => {
  const resetStore = useStore((state) => state.reset);
  const navigate = useNavigate();

  const logout = () => {
    localStorageUtils.remove({ key: 'token' });
    resetStore();
    navigate('/');
  };

  return logout;
};
