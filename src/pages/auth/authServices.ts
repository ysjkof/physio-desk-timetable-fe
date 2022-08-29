import { authTokenVar, isLoggedInVar } from '../../apollo';
import { loggedInUserVar } from '../../store';
import { removeLocalStorageItem, setLocalStorage } from '../../utils/utils';

export const login = (token: string, callback?: () => void) => {
  setLocalStorage({ key: 'TOKEN', value: token });
  authTokenVar(token);
  isLoggedInVar(true);

  if (callback) callback();
};

export const logout = (callback?: () => void) => {
  removeLocalStorageItem({ key: 'TOKEN' });
  authTokenVar(null);
  isLoggedInVar(false);
  loggedInUserVar(null);

  if (callback) callback();
};
