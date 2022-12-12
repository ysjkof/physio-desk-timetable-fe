import { useState } from 'react';
import { useForm, UseFormSetValue } from 'react-hook-form';
import { cls } from '../../../../utils/common.utils';
import { InputWithRef } from './InputForReserve';
import { useAutoComplete } from '../../../../hooks';
import { ClinicsOfClient } from '../../../../models';
import { SelectedValue } from './SelectedValue';
import type { FormOfReserveFields } from '../../../../types/form.types';

interface AutoCompleteForUserProps {
  label: string;
  userId: number;
  setValue: UseFormSetValue<FormOfReserveFields>;
}

const AutoCompleteForUser = ({
  label,
  userId,
  setValue: setValueOfParentInput,
}: AutoCompleteForUserProps) => {
  const selectionList = useState(ClinicsOfClient.selectedClinic.members)[0];
  const name = selectionList.find((member) => member.user.id === userId)?.user
    .name;
  const getUserId = (name: string) => {
    const user = selectionList.find((member) => member.user.name === name);
    if (!user) throw new Error('사용자를 찾을 수 없습니다.');
    return user.id;
  };

  const { register, setValue } = useForm<{ name: string }>({
    defaultValues: { name },
  });

  const firstListItem = selectionList[0];
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
      setValueOfParentInput('userId', getUserId(value));
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
          hasList && !selectedValue && selectionList
            ? 'rounded-b-none border-2 border-b-0 border-cst-blue'
            : ''
        )}
        register={register('name')}
        onKeyDown={keydownAtInput}
        onFocus={handleFocus}
        ref={inputRef}
      />
      {hasList && !selectedValue && selectionList && (
        <ul
          className="absolute z-10 w-full rounded-md rounded-t-none border-2 border-t-0 border-cst-blue bg-white"
          ref={ulRef}
        >
          <div>
            <div className="mx-3 border-b" />
          </div>
          {selectionList.map((member) => (
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
