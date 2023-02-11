import { addPrefixToNameWhenWaiting } from '../../utils/common.utils';
import { useFindMyMembers, useMe } from '../../hooks';
import { selectClinicId, useStore } from '../../store';
import Selectbox from '../Selectbox';

const ClinicSelector = () => {
  const [meData] = useMe();

  const [myMembers] = useFindMyMembers();

  const selectedClinicId = useStore((state) => state.selectedClinicId);

  const member = myMembers?.find((member) => member.id === selectedClinicId);

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
        {meData &&
          myMembers?.map((member) => (
            <Selectbox.Option
              key={member.id}
              selected={member.id === selectedClinicId}
              onClick={() =>
                selectClinicId({
                  clinicId: member.id,
                  userId: meData.id,
                  userName: meData.name,
                })
              }
            >
              {addPrefixToNameWhenWaiting(member.clinic.name, member.accepted)}
            </Selectbox.Option>
          ))}
      </Selectbox.Options>
    </Selectbox>
  );
};

export default ClinicSelector;
