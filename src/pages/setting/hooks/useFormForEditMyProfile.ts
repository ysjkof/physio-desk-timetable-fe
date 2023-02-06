import { useReactiveVar } from '@apollo/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { loggedInUserVar, toastVar } from '../../../store';
import { useEditProfile } from '../../../hooks';
import type { FormForEditMyProfileFields } from '../../../types/form.types';

const useFormForEditMyProfile = () => {
  const loggedInUser = useReactiveVar(loggedInUserVar);

  const { register, handleSubmit: handleSubmitWrapper } =
    useForm<FormForEditMyProfileFields>({
      defaultValues: {
        name: loggedInUser?.name,
      },
    });

  const [editProfile] = useEditProfile();

  const onSubmit: SubmitHandler<FormForEditMyProfileFields> = (data) => {
    if (!loggedInUser) return;

    const { name, currentPassword, newPassword1, newPassword2 } = data;

    const passwords = [currentPassword, newPassword1, newPassword2].filter(
      Boolean
    );

    if (passwords.length === 1 || passwords.length === 2) {
      return toastVar({
        messages: [
          '비밀번호를 변경하려면 현재 비밀번호,',
          '새 비밀번호, 새 비밀번호 확인을 모두 입력해주세요.',
        ],
      });
    }

    if (passwords.length === 3 && newPassword1 !== newPassword2) {
      return toastVar({
        messages: ['새 비밀번호와 새 비밀번호 확인이 다릅니다.'],
      });
    }

    const newName = name && (name !== loggedInUser.name || undefined) && name;
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
