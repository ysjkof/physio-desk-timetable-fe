import { authTokenVar, client, isLoggedInVar } from '../../apollo';
import { loggedInUserVar } from '../../store';
import { removeStorage, setStorage } from '../../utils/localStorageUtils';

export const login = (token: string, callback?: () => void) => {
  setStorage({ key: 'token', value: token });
  authTokenVar(token);
  isLoggedInVar(true);

  if (callback) callback();
};

export const logout = (callback?: () => void) => {
  removeStorage({ key: 'token' });
  authTokenVar(null);
  isLoggedInVar(false);
  loggedInUserVar(null);
  client.clearStore();

  if (callback) callback();
};
