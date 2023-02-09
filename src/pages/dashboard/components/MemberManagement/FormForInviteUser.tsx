import { InputWrapper, MenuButton } from '../../../../components';
import { REG_EXP } from '../../../../constants/regex';
import { Input } from '../../../timetable/components/FormForReservation/InputForReserve';
import { useFormForInviteUser } from '../../hooks/useFormForInviteUser';

const FormForInviteUser = () => {
  const { register, handleSubmit, error } = useFormForInviteUser();

  return (
    <form onSubmit={handleSubmit}>
      <InputWrapper label="직원 이름" align="col" error={error.nameError}>
        <Input
          label="직원 이름"
          register={register('name', { pattern: REG_EXP.personName.pattern })}
        />
      </InputWrapper>

      <MenuButton
        onClick={handleSubmit}
        type="submit"
        className="mt-6 w-36 rounded-md bg-cst-blue py-6 text-base font-medium text-white"
      >
        만들기
      </MenuButton>
    </form>
  );
};

export default FormForInviteUser;
