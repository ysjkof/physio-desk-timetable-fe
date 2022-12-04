import { type KeyboardEvent, useRef, useState } from 'react';
import type { UseFormRegisterReturn, UseFormSetValue } from 'react-hook-form';
import { cls } from '../../../../utils/common.utils';
import { InputWithRef } from './InputForReserve';
import type { FormOfReserveFields } from '../../../../types/form.types';
import type {
  MemberOfClient,
  ObjValueIsFx,
} from '../../../../types/common.types';

interface AutoCompleteProps {
  label: string;
  members: MemberOfClient[];
  register: UseFormRegisterReturn;
  setValue: UseFormSetValue<FormOfReserveFields>;
}

const AutoComplete = ({
  label,
  members,
  register,
  setValue,
}: AutoCompleteProps) => {
  const [hasList, setHasList] = useState(false);
  const firstButtonId = `auto-complete_${members[0].id}-${members[0].user.name}`;
  const ulRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const select = (name: string) => {
    setValue('user', name);
    inputRef.current?.focus();
    setHasList(false);
  };

  const openList = () => setHasList(true);
  const closeList = () => setHasList(false);

  const handleKeydown = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    if (!hasList) return openList();
    const action: ObjValueIsFx = {
      Escape() {
        closeList();
      },
      ArrowDown() {
        const firstButton = document.getElementById(firstButtonId);
        firstButton?.focus();
      },
    };
    action[key]?.();
  };

  const handleKeydownAtButton = (event: KeyboardEvent<HTMLButtonElement>) => {
    const { key } = event;
    const action: ObjValueIsFx = {
      Enter() {
        select(event.currentTarget.textContent || '');
      },
      Escape() {
        if (!hasList) return;
        closeList();
      },
      ArrowUp() {
        const buttonId =
          event.currentTarget.parentElement?.previousElementSibling?.children.item(
            0
          )?.id;
        if (!buttonId) {
          return inputRef.current?.focus();
        }
        const previousButton = document.getElementById(buttonId);
        previousButton?.focus();
      },
      ArrowDown() {
        const buttonId =
          event.currentTarget.parentElement?.nextElementSibling?.children.item(
            0
          )?.id;
        if (!buttonId) return;
        const nestButton = document.getElementById(buttonId);
        return nestButton?.focus();
      },
      Tab() {
        const currentButtonId =
          event.currentTarget.parentElement?.firstElementChild?.id;
        const lastButtonId =
          ulRef.current?.lastElementChild?.firstElementChild?.id;
        if (currentButtonId === lastButtonId) {
          closeList();
        }
      },
    };
    action[key]?.();
  };

  return (
    <div className="relative w-full">
      <InputWithRef
        label={label}
        placeholder="성함을 입력하시면 검색이 가능합니다."
        required
        className={cls(
          'text-cst-blue outline-none',
          hasList ? 'rounded-b-none border-2 border-b-0 border-cst-blue' : ''
        )}
        register={register}
        onKeyDown={handleKeydown}
        onFocus={openList}
        ref={inputRef}
      />
      {hasList && (
        <>
          <ul
            className="absolute w-full rounded-md rounded-t-none border-2 border-t-0 border-cst-blue bg-white"
            ref={ulRef}
          >
            <div>
              <div className="mx-3 border-b" />
            </div>
            {members.map((m) => (
              <li key={`auto-complete_${m.id}-${m.user.name}`}>
                <button
                  id={`auto-complete_${m.id}-${m.user.name}`}
                  type="button"
                  value={m.user.id}
                  className="w-full py-1.5 px-3 text-left"
                  onClick={() => select(m.user.name)}
                  onKeyDown={handleKeydownAtButton}
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

export default AutoComplete;
