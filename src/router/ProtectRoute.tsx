import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectRouteProps {
  isPass: boolean | undefined;
  children: ReactNode;
  alarm?: string;
}

interface ProtectRouteLinkProps extends ProtectRouteProps {
  goWhenFail: string;
  failElement?: false;
}
interface ProtectRouteElementProps extends ProtectRouteProps {
  failElement: ReactNode;
  goWhenFail?: false;
}

type ProtectRouteType = ProtectRouteLinkProps | ProtectRouteElementProps;

/**
 * 접근 권한이 없는 경로로 올 경우(`isPass === false`) 리다이렉트 한다
 * @param alarm `useLocation().state.alarm`에 전달한다
 */
export default function ProtectRoute({
  isPass,
  goWhenFail,
  failElement,
  children,
  alarm,
}: ProtectRouteType) {
  if (goWhenFail) {
    const handleFailPass = () => {
      return Navigate({ to: goWhenFail, state: { alarm } });
    };
    return isPass ? <>{children}</> : handleFailPass();
  }
  return isPass ? <>{children}</> : <>{failElement}</>;
}
