import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { localStorageUtils } from '../utils/localStorageUtils';

interface ProtectRouteProps {
  children: ReactNode;
  whenFail: ReactNode | string;
}

interface ProtectRoutePassProps extends ProtectRouteProps {
  isPass: boolean;
  failWhenLogin?: false | undefined;
  failWhenLogout?: false | undefined;
}
interface ProtectRouteLoginProps extends ProtectRouteProps {
  isPass?: false | undefined;
  failWhenLogin: boolean;
  failWhenLogout?: false | undefined;
}
interface ProtectRouteLogoutProps extends ProtectRouteProps {
  isPass?: false | undefined;
  failWhenLogin?: false | undefined;
  failWhenLogout: boolean;
}

type ProtectRouteType =
  | ProtectRoutePassProps
  | ProtectRouteLoginProps
  | ProtectRouteLogoutProps;

export default function ProtectRoute({
  isPass,
  whenFail,
  children,
  failWhenLogin,
  failWhenLogout,
}: ProtectRouteType) {
  const authToken = localStorageUtils.get<string>({ key: 'token' });

  if (failWhenLogin && typeof whenFail === 'string') {
    return authToken ? Navigate({ to: whenFail }) : <>{children}</>;
  }
  if (failWhenLogin) {
    return authToken ? <>{whenFail}</> : <>{children}</>;
  }
  if (failWhenLogout && typeof whenFail === 'string') {
    return authToken ? <>{children}</> : Navigate({ to: whenFail });
  }
  if (failWhenLogout) {
    return authToken ? <>{children}</> : <>{whenFail}</>;
  }
  return isPass ? <>{children}</> : <>{whenFail}</>;
}
