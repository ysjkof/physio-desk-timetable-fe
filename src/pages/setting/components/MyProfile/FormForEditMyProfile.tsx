import { InputWrapper, MenuButton } from '../../../../components';
import { Input } from '../../../../components';
import useFormForEditMyProfile from '../../hooks/useFormForEditMyProfile';
import type { ToggleEditMode } from '../../../../types/propsTypes';

const FormForEditMyProfile = ({ toggleEditMode }: ToggleEditMode) => {
  const { handleSubmit, register } = useFormForEditMyProfile();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <InputWrapper label="이름" htmlFor="이름" align="col">
        <Input id="이름" register={register('name')} />
      </InputWrapper>
      <InputWrapper label="현재 비밀번호" htmlFor="현재 비밀번호" align="col">
        <Input
          id="현재 비밀번호"
          register={register('currentPassword')}
          type="password"
        />
      </InputWrapper>
      <InputWrapper label="새 비밀번호" htmlFor="새 비밀번호" align="col">
        <Input
          id="새 비밀번호"
          register={register('newPassword1')}
          type="password"
        />
      </InputWrapper>
      <InputWrapper label="새 비밀번호 확인" htmlFor="새 비밀번호" align="col">
        <Input
          id="새 비밀번호 확인"
          register={register('newPassword2')}
          type="password"
        />
      </InputWrapper>
      <div className="flex gap-4 py-4">
        <MenuButton
          type="button"
          className="w-full rounded-md bg-close-bg py-6 text-base font-medium text-font-gray"
          onClick={toggleEditMode}
        >
          닫기
        </MenuButton>

        <MenuButton
          onClick={handleSubmit}
          type="submit"
          className="w-full rounded-md bg-cst-blue py-6 text-base font-medium text-white"
        >
          적용하기
        </MenuButton>
      </div>
    </form>
  );
};

export default FormForEditMyProfile;
