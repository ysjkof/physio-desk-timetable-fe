import { useForm } from 'react-hook-form';
import { cls } from '../../../../utils/common.utils';
import { InputWithRef } from './InputForReserve';
import { useAutoComplete, useGetClinic } from '../../../../hooks';
import { SelectedValue } from './SelectedValue';

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
  const [clinic] = useGetClinic();

  const name = clinic?.members.find((member) => member.user.id === userId)?.user
    .name;
  const getUserId = (name: string) => {
    const user = clinic?.members.find(
      (member) => member.user.name === name
    )?.user;
    if (!user) throw new Error('사용자를 찾을 수 없습니다.');
    return user.id;
  };

  const { register, setValue } = useForm<{ name: string }>({
    defaultValues: { name },
  });

  const firstListItem = clinic?.members[0];
  const firstButtonId = firstListItem
    ? `auto-complete__user_${firstListItem.id}-${firstListItem.user.name}`
    : '';

  const {
    hasList,
    selectedValue,
    ulRef,
    inputRef,
    keydownAtInput,
    keydownAtButton,
    openList,
    select,
    clearValue,
  } = useAutoComplete<string>({
    firstButtonId,
    setInput(value) {
      if (!value) throw Error('Input 값의 유형이 바르지 않습니다.');
      setValue('name', value);
      setParentValue(getUserId(value));
    },
    initialValue: name,
  });

  const handleFocus = () => {
    if (!firstListItem || hasList) return;
    openList();
  };

  if (selectedValue)
    return (
      <SelectedValue clearValue={clearValue}>{selectedValue}</SelectedValue>
    );

  return (
    <div className="relative w-full">
      <InputWithRef
        label={label}
        placeholder="성함을 입력하시면 검색이 가능합니다."
        className={cls(
          'text-cst-blue outline-none',
          hasList && !selectedValue && clinic
            ? 'rounded-b-none border-2 border-b-0 border-cst-blue'
            : ''
        )}
        register={register('name')}
        onKeyDown={keydownAtInput}
        onFocus={handleFocus}
        ref={inputRef}
      />
      {hasList && !selectedValue && clinic && (
        <ul
          className="absolute z-10 w-full rounded-md rounded-t-none border-2 border-t-0 border-cst-blue bg-white"
          ref={ulRef}
        >
          <div>
            <div className="mx-3 border-b" />
          </div>
          {clinic?.members.map((member) => (
            <li key={`auto-complete__user_${member.id}-${member.user.name}`}>
              <button
                id={`auto-complete__user_${member.id}-${member.user.name}`}
                type="button"
                value={member.user.id}
                className="w-full py-1.5 px-3 text-left"
                onClick={() => select(member.user.name)}
                onKeyDown={keydownAtButton}
              >
                {member.user.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteForUser;
