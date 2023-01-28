import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';

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
  console.log(
    'isLoggedInVar >>',
    isLoggedInVar(),
    'failWhenLogin >>',
    failWhenLogin,
    'failWhenLogout >>',
    failWhenLogout
  );

  if (failWhenLogin && typeof whenFail === 'string') {
    return isLoggedInVar() ? Navigate({ to: whenFail }) : <>{children}</>;
  }
  if (failWhenLogin) {
    return isLoggedInVar() ? <>{whenFail}</> : <>{children}</>;
  }
  if (failWhenLogout && typeof whenFail === 'string') {
    return isLoggedInVar() ? <>{children}</> : Navigate({ to: whenFail });
  }
  if (failWhenLogout) {
    return isLoggedInVar() ? <>{children}</> : <>{whenFail}</>;
  }
  return isPass ? <>{children}</> : <>{whenFail}</>;
}
