import { type ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { cls, isArrayAndValue } from '../../../../utils/commonUtils';
import { InputWithRef } from '../../../../components';
import { useGetClinic } from '../../../../hooks';
import { Member } from '../../../../models';
import type { MemberOfGetMyClinic } from '../../../../types/processedGeneratedTypes';
import type { PropsWithName } from '../../../../types/formTypes';

interface AutoCompleteForUserProps {
  label: string;
  userId: number;
  setParentValue: (userId: number) => void;
}

const AutoCompleteForUser = ({
  label,
  userId,
  setParentValue,
}: AutoCompleteForUserProps) => {
  const [members, setMembers] = useState<MemberOfGetMyClinic[]>();

  const clearMembers = () => setMembers(undefined);

  const [clinic] = useGetClinic();
  const name = clinic?.members.find((member) => member.user.id === userId)?.user
    .name;

  const { register, setValue } = useForm<PropsWithName>({
    defaultValues: { name },
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!clinic || isArrayAndValue(members)) return;
    setMembers(clinic.members);
  };

  const select = (name: string) => {
    setValue('name', name);
    setParentValue(getUserId(name));
    clearMembers();
  };

  const getUserId = (name: string) => {
    const user = clinic?.members.find(
      (member) => member.user.name === name
    )?.user;
    if (!user) throw new Error('사용자를 찾을 수 없습니다.');
    return user.id;
  };

  return (
    <div className="relative w-full">
      <InputWithRef
        label={label}
        placeholder="이름을 입력하면 검색이 가능합니다."
        className={cls(
          'text-cst-blue outline-none',
          members ? 'rounded-b-none border-2 border-b-0 border-cst-blue' : ''
        )}
        register={register('name', { onChange: handleInputChange })}
        autoComplete="off"
      />
      {members && (
        <ul className="absolute z-10 w-full rounded-md rounded-t-none border-2 border-t-0 border-cst-blue bg-white">
          <div className="mx-2 border-b" />
          {members.map((_member) => {
            const member = new Member(_member);
            if (!member.isMemberActive()) return null;

            const userId = _member.user.id;
            const name = member.getName();

            return (
              <li key={userId}>
                <button
                  type="button"
                  value={userId}
                  className="w-full py-1.5 px-3 text-left"
                  onClick={() => select(name)}
                >
                  {name}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteForUser;
