import { PropsWithChildren, ReactNode } from 'react';
import { useFindMyMembers } from '../hooks';
import { getMemberState } from '../utils/commonUtils';

interface ProtectStayMemberProps extends PropsWithChildren {
  clinicId: number | undefined;
  fallback: ReactNode;
}

export const ProtectStayMember = ({
  clinicId,
  children,
  fallback,
}: ProtectStayMemberProps) => {
  const [myMembers] = useFindMyMembers();
  const myMember = myMembers?.find((member) => member.clinic.id === clinicId);

  const status = myMember
    ? getMemberState({
        accepted: myMember.accepted,
        manager: myMember.manager,
        staying: myMember.staying,
      })
    : null;

  if (status === '탈퇴' || status === '수락대기') return <>{fallback}</>;

  return <>{children}</>;
};
