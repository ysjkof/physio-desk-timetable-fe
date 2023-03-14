import { PropsWithChildren, ReactNode } from 'react';
import { useGetMyMembers } from '../hooks';
import { getMemberState, isMemberActive } from '../utils/commonUtils';

interface ProtectStayMemberProps extends PropsWithChildren {
  clinicId: number | undefined;
  fallback: ReactNode;
}

export const ProtectStayMember = ({
  clinicId,
  children,
  fallback,
}: ProtectStayMemberProps) => {
  const [myMembers] = useGetMyMembers();
  const myMember = myMembers?.find((member) => member.clinic.id === clinicId);

  const status = myMember
    ? getMemberState({
        accepted: myMember.accepted,
        manager: myMember.manager,
        staying: myMember.staying,
      })
    : null;

  if (status && !isMemberActive(status)) return <>{fallback}</>;

  return <>{children}</>;
};
