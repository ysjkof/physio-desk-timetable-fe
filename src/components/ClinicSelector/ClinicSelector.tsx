import { useFindMyMembers } from '../../hooks';
import { useStore } from '../../store';
import { BarsArrowDown } from '../../svgs';
import { renameUseSplit } from '../../utils/commonUtils';
import ClinicSelectorBtn from './ClinicSelectorBtn';

const ClinicSelector = () => {
  const [myMember] = useFindMyMembers();
  const pickedClinicId = useStore((state) => state.pickedClinicId);
  const clinic = myMember?.find(
    (member) => member.clinic.id === pickedClinicId
  )?.clinic;

  return (
    <details className="clinic-selector">
      <summary className="flex list-none items-center justify-center gap-2 py-1 text-xl">
        {renameUseSplit(clinic?.name || '')}
        <BarsArrowDown iconSize="LG" />
      </summary>
      <div className="absolute top-9 flex w-full flex-col overflow-hidden rounded-md bg-white text-base shadow-cst">
        {myMember?.map((member) => (
          <ClinicSelectorBtn key={member.id} member={member} />
        ))}
      </div>
    </details>
  );
};

export default ClinicSelector;
