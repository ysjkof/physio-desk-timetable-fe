import { useNavigate } from 'react-router-dom';
import { resetStore } from '../store';
import { localStorageUtils } from '../utils/localStorageUtils';
import { client } from '../apollo';

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorageUtils.remove({ key: 'token' });
    resetStore();
    client.clearStore();
    navigate('/');
  };

  return logout;
};
