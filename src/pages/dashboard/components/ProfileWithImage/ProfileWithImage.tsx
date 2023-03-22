import { useGetMyMembers, useMe } from '../../../../hooks';
import { useStore } from '../../../../store';
import { User } from '../../../../svgs';

interface ProfileWithImageProps {
  hasPosition?: boolean;
}

const ProfileWithImage = ({ hasPosition }: ProfileWithImageProps) => {
  const [meData] = useMe();
  const clinicId = useStore((state) => state.pickedClinicId);
  const [myMembers] = useGetMyMembers();
  const clinic = myMembers?.find((member) => member.clinic.id === clinicId);

  if (!meData?.name || !clinic) return null;
  const name = meData.name;

  let position;
  if (hasPosition && typeof clinic.manager === 'boolean') {
    position = clinic.manager ? '관리자' : '직원';
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-2 h-20 w-20 overflow-hidden rounded-full bg-gray-200">
        <User className="position-center-x absolute top-3 h-full w-4/6 fill-white stroke-white" />
      </div>
      <div className="text-base">
        {position && <span className="mr-1">{position}</span>}
        <span>{name}</span>
      </div>
    </div>
  );
};

export default ProfileWithImage;
