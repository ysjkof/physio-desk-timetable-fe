import { authTokenVar, client, isLoggedInVar } from '../../apollo';
import { loggedInUserVar } from '../../store';
import { removeLocalStorageItem, setLocalStorage } from '../../utils/utils';

export const login = (token: string, callback?: () => void) => {
  setLocalStorage({ key: 'token', value: token });
  authTokenVar(token);
  isLoggedInVar(true);

  if (callback) callback();
};

export const logout = (callback?: () => void) => {
  removeLocalStorageItem({ key: 'token' });
  authTokenVar(null);
  isLoggedInVar(false);
  loggedInUserVar(null);
  client.clearStore();

  if (callback) callback();
};
