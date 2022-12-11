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
  setValue: UseFormSetValue<FormOfReserveFields>;
}

const AutoCompleteForUser = ({
  label,
  setValue: setValueOfParentInput,
}: AutoCompleteForUserProps) => {
  const selectionList = useState(ClinicsOfClient.selectedClinic.members)[0];

  const { register, setValue } = useForm<Pick<FormOfReserveFields, 'user'>>();

  const firstMember = selectionList[0];
  const firstButtonId = firstMember
    ? `auto-complete__user_${firstMember.id}-${firstMember.user.name}`
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
      setValue('user', value);
      setValueOfParentInput('user', value);
    },
  });

  const handleFocus = () => {
    if (!firstMember || hasList) return;
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
        register={register('user')}
        onKeyDown={keydownAtInput}
        onFocus={handleFocus}
        ref={inputRef}
      />
      {hasList && !selectedValue && selectionList && (
        <>
          <ul
            className="absolute z-10 w-full rounded-md rounded-t-none border-2 border-t-0 border-cst-blue bg-white"
            ref={ulRef}
          >
            <div>
              <div className="mx-3 border-b" />
            </div>
            {selectionList.map((m) => (
              <li key={`auto-complete__user_${m.id}-${m.user.name}`}>
                <button
                  id={`auto-complete__user_${m.id}-${m.user.name}`}
                  type="button"
                  value={m.user.id}
                  className="w-full py-1.5 px-3 text-left"
                  onClick={() => select(m.user.name)}
                  onKeyDown={keydownAtButton}
                >
                  {m.user.name}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default AutoCompleteForUser;
