import { setAuthToken } from '../store';
import { localStorageUtils } from '../utils/localStorageUtils';

export const useLogin = () => {
  const login = (token: string, callback?: () => void) => {
    localStorageUtils.set({ key: 'token', value: token });
    setAuthToken(token);

    if (callback) callback();
  };

  return login;
};
