import { TableDisplay } from '../../../models/TableDisplay';
import { hasTableDisplayVar, tableDisplayVar } from '../../../store';
import type { TableDisplayOptions } from '../../../types/common.types';

export function useTableDisplay() {
  const hasTableDisplay = hasTableDisplayVar();

  const toggleDisplayController = (value?: boolean) => {
    const option = value === undefined ? !hasTableDisplay : value;
    hasTableDisplayVar(option);
  };

  const toggleDisplayOption = (key: keyof TableDisplayOptions) => {
    const value = TableDisplay.createToggledValue(key);
    TableDisplay.setValue(value);
    TableDisplay.saveToLocalStorage(value);
    tableDisplayVar(value);
  };

  return { toggleDisplayController, toggleDisplayOption };
}
