import { useReactiveVar } from '@apollo/client';
import { loggedInUserVar } from '../../../../store';
import { ClinicsOfClient } from '../../../../models';

const Profile = () => {
  const loggedInUser = useReactiveVar(loggedInUserVar);

  return (
    <div className="flex flex-col items-center">
      <img
        alt="프로필 사진"
        className="mb-2 h-20 w-20 rounded-full bg-gray-200"
      />
      <div className="text-base">
        <span className="mr-1">
          {ClinicsOfClient.getSelectedClinic().position}
        </span>
        <span>{loggedInUser?.name}</span>
      </div>
    </div>
  );
};

export default Profile;
