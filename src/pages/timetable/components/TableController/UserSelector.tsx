import { USER_COLORS } from '../../../../constants/constants';
import { CheckableButton } from '../../../../components';
import { useSelectedClinic } from '../../hooks';
import { ClinicsOfClient } from '../../../../models';

const UserSelector = () => {
  const { toggleUser } = useSelectedClinic();

  const toggleUsers = (memberId: number) => {
    toggleUser(memberId);
  };

  return (
    <div className="flex gap-2">
      {ClinicsOfClient.selectedClinic?.members.map((member, i) => (
        <CheckableButton
          key={i}
          color="black"
          backgroundColor={USER_COLORS[i].deep}
          canSee={!!member.canSee}
          label={member.user.name}
          onClick={() => toggleUsers(member.id)}
        />
      ))}
    </div>
  );
};

export default UserSelector;
