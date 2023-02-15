import { KeyboardEvent, useRef, useState } from 'react';
import { useDebounce } from './useDebounce';
import type { ObjValueIsFx } from '../types/commonTypes';
import type { UseAutoCompleteProps } from '../types/propsTypes';

export const useAutoComplete = <T>({
  firstButtonId,
  setInput,
  clearList,
  query,
  initialValue,
}: UseAutoCompleteProps<T>) => {
  const [hasList, setHasList] = useState(false);
  const [selectedValue, setSelectedValue] = useState<T | null>(
    initialValue || null
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);

  const debounce = useDebounce({
    callback() {
      if (!inputRef.current || !query) return;
      query(inputRef.current.value);
    },
  });

  const select = (value: T | null) => {
    setInput(value);
    setSelectedValue(() => {
      if (Array.isArray(value) && value.length === 0) return null;
      return value;
    });
    setHasList(false);
    inputRef.current?.blur();
  };

  const clearValue = () => {
    setSelectedValue(null);
    clearList?.();
  };

  const openList = () => setHasList(true);
  const closeList = () => setHasList(false);

  const keydownAtInput = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key, shiftKey } = event;

    const action: ObjValueIsFx = {
      Escape() {
        return closeList();
      },
      ArrowDown() {
        if (!hasList) return openList();
        const firstButton = document.getElementById(firstButtonId);
        return firstButton?.focus();
      },
      Tab() {
        if (!shiftKey) return;
        return closeList();
      },
    };
    action[key]?.();

    if (!query) return;
    debounce();
  };

  const keydownAtButton = (
    event: KeyboardEvent<HTMLButtonElement>,
    selectedValue?: T
  ) => {
    const { key } = event;

    const action: ObjValueIsFx = {
      Enter() {
        const value =
          selectedValue || (event.currentTarget.textContent as T) || null;
        select(value);
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
        nestButton?.focus();
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

  return {
    hasList,
    selectedValue,
    ulRef,
    inputRef,
    select,
    openList,
    closeList,
    keydownAtInput,
    keydownAtButton,
    clearValue,
  };
};
