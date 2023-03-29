import { InputWrapper, MenuButton } from '../../../../components';
import { REG_EXP } from '../../../../constants/regex';
import { Input } from '../../../../components';
import { useFormForInviteUser } from '../../hooks/useFormForInviteUser';

const FormForInviteUser = () => {
  const { register, handleSubmit, error } = useFormForInviteUser();

  return (
    <form onSubmit={handleSubmit}>
      <InputWrapper
        label="직원 이름"
        htmlFor="직원 이름"
        align="col"
        error={error.nameError}
      >
        <Input
          id="직원 이름"
          register={register('name', { pattern: REG_EXP.personName.pattern })}
        />
      </InputWrapper>

      <MenuButton
        onClick={handleSubmit}
        type="submit"
        className="mt-6 w-36 rounded-md bg-cst-blue py-6 text-base font-medium text-white"
      >
        초대하기
      </MenuButton>
    </form>
  );
};

export default FormForInviteUser;
