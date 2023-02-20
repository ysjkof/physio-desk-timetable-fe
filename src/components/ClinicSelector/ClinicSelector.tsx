import { useFindMyMembers } from '../../hooks';
import ClinicSelectorBtn from './ClinicSelectorBtn';

const ClinicSelector = () => {
  const [myMembers] = useFindMyMembers();

  return (
    <div className="flex flex-col">
      {myMembers?.map((member) => (
        <ClinicSelectorBtn key={member.id} member={member} />
      ))}
    </div>
  );
};

export default ClinicSelector;
