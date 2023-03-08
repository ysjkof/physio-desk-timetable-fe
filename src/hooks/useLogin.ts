import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../store';
import { localStorageUtils } from '../utils/localStorageUtils';

export const useLogin = () => {
  const navigate = useNavigate();
  const login = (token: string) => {
    localStorageUtils.set({ key: 'token', value: token });

    setAuthToken(token);

    navigate('/');
  };

  return login;
};
