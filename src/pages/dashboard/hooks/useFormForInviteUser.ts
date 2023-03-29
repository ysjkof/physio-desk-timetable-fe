import { type SubmitHandler, useForm } from 'react-hook-form';
import { useInviteUser } from '../../../hooks';
import { REG_EXP } from '../../../constants/regex';
import { setConfirm, useStore } from '../../../store';

interface UseFormForInviteUserFields {
  name: string;
}

export const useFormForInviteUser = () => {
  const clinicId = useStore((state) => state.pickedClinicId);

  const {
    register,
    handleSubmit: handleSubmitWrapper,
    formState: { errors },
  } = useForm<UseFormForInviteUserFields>({ mode: 'onChange' });

  const { inviteUser } = useInviteUser();

  const onSubmit: SubmitHandler<UseFormForInviteUserFields> = (data) => {
    const { name } = data;
    if (!name) return;

    setConfirm({
      buttonText: '초대하기',
      confirmAction: () => {
        inviteUser(clinicId, name);
      },
      messages: [`${name}님을 초대합니다`],
      targetName: '',
      isPositive: true,
    });
  };

  const handleSubmit = handleSubmitWrapper(onSubmit);

  const nameError =
    errors.name?.type === 'pattern' && REG_EXP.personName.condition;
  const error = { nameError };

  return { register, handleSubmit, error };
};
