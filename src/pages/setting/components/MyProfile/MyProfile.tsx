import { useState } from 'react';
import FormForEditMyProfile from './FormForEditMyProfile';
import FormForEditEmail from './FormForEditEmail';
import { useMe } from '../../../../hooks';

const MyProfile = () => {
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  return (
    <div className="px-14 py-10">
      <Title />
      <div className="mt-10 flex w-[460px] flex-col gap-4">
        {isEditMode ? (
          <>
            <FormForEditEmail />
            <FormForEditMyProfile toggleEditMode={toggleEditMode} />
          </>
        ) : (
          <ProfileMain toggleEditMode={toggleEditMode} />
        )}
      </div>
    </div>
  );
};

const Title = () => {
  return (
    <div className="flex flex-col items-baseline">
      <h1 className="text-2xl font-semibold text-[#262850]">나의 정보</h1>
      <span className="text-[#8D8DAD]">
        개인정보를 확인하고 수정할 수 있습니다.
      </span>
    </div>
  );
};

const ProfileMain = ({ toggleEditMode }: { toggleEditMode: () => void }) => {
  const [meData] = useMe();
  return (
    <div className="flex w-80 flex-col gap-4">
      <ProfileItem title="Email" textContent={meData?.email || '-'} />
      <ProfileItem title="이름" textContent={meData?.name || '-'} />
      <button
        onClick={toggleEditMode}
        type="button"
        className="w-fit rounded-md bg-[#6BA6FF] px-8 py-2 text-white"
      >
        정보 수정하기
      </button>
    </div>
  );
};

const ProfileItem = ({
  title,
  textContent,
}: {
  title: string;
  textContent: string;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[#8D8DAD]">{title}</span>
      <span className="input text-[#5D5A5A]">{textContent}</span>
    </div>
  );
};

export default MyProfile;
