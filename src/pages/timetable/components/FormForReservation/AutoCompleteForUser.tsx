import { type ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  cls,
  getMemberState,
  isArrayAndValue,
} from '../../../../utils/commonUtils';
import { InputWithRef } from '../../../../components';
import { useGetClinic } from '../../../../hooks';
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
      />
      {members && (
        <ul className="absolute z-10 w-full rounded-md rounded-t-none border-2 border-t-0 border-cst-blue bg-white">
          <div className="mx-2 border-b" />
          {members.map((member) => {
            const { accepted, manager, staying } = member;
            const state = getMemberState({ accepted, manager, staying });
            if (state === '탈퇴' || state === '수락대기') return null;

            return (
              <li key={member.id}>
                <button
                  type="button"
                  value={member.user.id}
                  className="w-full py-1.5 px-3 text-left"
                  onClick={() => select(member.user.name)}
                >
                  {member.user.name}
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
