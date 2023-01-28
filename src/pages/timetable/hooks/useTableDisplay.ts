import { useReactiveVar } from '@apollo/client';
import { TableDisplay } from '../../../models/TableDisplay';
import { hasTableDisplayVar, tableDisplayVar } from '../../../store';
import type { TableDisplayOptions } from '../../../types/common.types';

export const useTableDisplay = () => {
  const tableDisplay = useReactiveVar(tableDisplayVar);

  const toggleDisplayController = (value?: boolean) => {
    const option = value ?? !hasTableDisplayVar();
    hasTableDisplayVar(option);
  };

  const toggleDisplayOption = (key: keyof TableDisplayOptions) => {
    const value = TableDisplay.createToggledValue(key);
    TableDisplay.setValue(value);
    TableDisplay.saveToLocalStorage(value);
    tableDisplayVar(value);
  };

  return { tableDisplay, toggleDisplayController, toggleDisplayOption };
};
