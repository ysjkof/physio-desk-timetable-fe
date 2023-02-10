import { useStore } from '../store';
import localStorageUtils from '../utils/localStorage.utils';

export const useLogin = () => {
  const setAuthToken = useStore((state) => state.setAuthToken);

  const login = (token: string, callback?: () => void) => {
    localStorageUtils.set({ key: 'token', value: token });
    setAuthToken(token);

    if (callback) callback();
  };

  return login;
};
