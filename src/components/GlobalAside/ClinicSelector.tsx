import { addPrefixToNameWhenWaiting } from '../../utils/common.utils';
import { useFindMyMembers } from '../../hooks';
import { selectClinicId, useStore } from '../../store';
import Selectbox from '../Selectbox';

const ClinicSelector = () => {
  const { data } = useFindMyMembers();
  const selectedClinicId = useStore((state) => state.selectedClinicId);

  const member = data?.findMyMembers.members?.find(
    (member) => member.id === selectedClinicId
  );

  return (
    <Selectbox
      selectedValue={addPrefixToNameWhenWaiting(
        member?.clinic.name || '이름없는에러',
        member?.accepted
      )}
      hasBorder
      backgroundColor="#262850"
    >
      <Selectbox.Options>
        {data?.findMyMembers.members?.map((member) => (
          <Selectbox.Option
            key={member.id}
            selected={member.id === selectedClinicId}
            onClick={() => selectClinicId(member.id)}
          >
            {addPrefixToNameWhenWaiting(member.clinic.name, member.accepted)}
          </Selectbox.Option>
        ))}
      </Selectbox.Options>
    </Selectbox>
  );
};

export default ClinicSelector;
