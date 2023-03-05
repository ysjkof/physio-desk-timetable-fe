import { useGetMyMembers } from '../../hooks';
import { useStore } from '../../store';
import { renameUseSplit } from '../../utils/commonUtils';
import Selectbox from '../Selectbox';
import ClinicSelectorBtn from './ClinicSelectorBtn';

const ClinicSelector = () => {
  const [myMember] = useGetMyMembers();
  const pickedClinicId = useStore((state) => state.pickedClinicId);
  const clinic = myMember?.find(
    (member) => member.clinic.id === pickedClinicId
  )?.clinic;

  return (
    <div className="clinic-selector">
      <Selectbox label={renameUseSplit(clinic?.name || '')}>
        <Selectbox.Options>
          {myMember?.map((member) => (
            <Selectbox.Option key={member.id} onClick={() => {}}>
              <ClinicSelectorBtn member={member} />
            </Selectbox.Option>
          ))}
        </Selectbox.Options>
      </Selectbox>
    </div>
  );
};

export default ClinicSelector;
