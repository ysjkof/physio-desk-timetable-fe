import { SubmitHandler, useForm } from 'react-hook-form';
import { setToast } from '../../../store';
import { useEditProfile, useMe } from '../../../hooks';
import type { FormForEditMyProfileFields } from '../../../types/form.types';

const useFormForEditMyProfile = () => {
  const [meData] = useMe();

  const { register, handleSubmit: handleSubmitWrapper } =
    useForm<FormForEditMyProfileFields>({
      defaultValues: {
        name: meData?.name,
      },
    });

  const [editProfile] = useEditProfile();

  const onSubmit: SubmitHandler<FormForEditMyProfileFields> = (data) => {
    if (!meData) return;

    const { name, currentPassword, newPassword1, newPassword2 } = data;

    const passwords = [currentPassword, newPassword1, newPassword2].filter(
      Boolean
    );

    if (passwords.length === 1 || passwords.length === 2) {
      return setToast({
        messages: [
          '비밀번호를 변경하려면 현재 비밀번호,',
          '새 비밀번호, 새 비밀번호 확인을 모두 입력해주세요.',
        ],
      });
    }

    if (passwords.length === 3 && newPassword1 !== newPassword2) {
      return setToast({
        messages: ['새 비밀번호와 새 비밀번호 확인이 다릅니다.'],
      });
    }

    const newName = name && (name !== meData.name || undefined) && name;
    const newPassword =
      currentPassword &&
      (newPassword1 === newPassword2 || undefined) &&
      newPassword1;

    editProfile({
      variables: {
        input: {
          name: newName,
          currentPassword,
          newPassword,
        },
      },
    });
  };

  const handleSubmit = handleSubmitWrapper(onSubmit);

  return { register, handleSubmit };
};

export default useFormForEditMyProfile;
