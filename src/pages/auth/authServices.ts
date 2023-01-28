import { authTokenVar, client, isLoggedInVar } from '../../apollo';
import { loggedInUserVar } from '../../store';
import localStorageUtils from '../../utils/localStorage.utils';

export const login = (token: string, callback?: () => void) => {
  localStorageUtils.set({ key: 'token', value: token });
  authTokenVar(token);
  isLoggedInVar(true);

  if (callback) callback();
};

export const logout = (callback?: () => void) => {
  localStorageUtils.remove({ key: 'token' });
  authTokenVar(null);
  isLoggedInVar(false);
  loggedInUserVar(null);
  client.clearStore();

  if (callback) callback();
};
