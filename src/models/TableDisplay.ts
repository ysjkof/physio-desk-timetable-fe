import localStorageUtils from '../utils/localStorageUtils';
import type { TableDisplayOptions, UserIdAndName } from '../types/common.types';

export class TableDisplay {
  static #options: TableDisplayOptions = {
    hasWeekView: true,
    seeCancel: true,
    seeNoshow: true,
    seeList: false,
    navigationExpand: false,
  };
  static #userIdAndName: UserIdAndName;
  static #localStorageUtil = localStorageUtils;

  static initialize(userIdAndName: UserIdAndName) {
    this.#userIdAndName = userIdAndName;
  }

  static setValue(options: TableDisplayOptions) {
    this.#options = options;
  }

  static saveToLocalStorage(value: TableDisplayOptions) {
    if (!this.#hasUserIdAndName) throw this.#initialError;

    this.#localStorageUtil.set({
      key: 'viewOption',
      value,
      ...this.#userIdAndName,
    });
  }

  static getFromLocalStorage() {
    if (!this.#hasUserIdAndName) throw this.#initialError;

    return this.#localStorageUtil.get<TableDisplayOptions>({
      key: 'viewOption',
      ...this.#userIdAndName,
    });
  }

  static get #hasUserIdAndName() {
    return !!this.#userIdAndName;
  }

  static get #initialError() {
    return new Error('TableTime이 초기화되지 않았습니다.', {
      cause:
        'TableTime클래스는 초기화 메소드를 수행한 뒤에 정상작동합니다. TableTime.initialSetup()을 수행해주세요.',
    });
  }

  static get value() {
    return this.#options;
  }

  static createToggledValue(key: keyof TableDisplayOptions) {
    return { ...this.#options, [key]: !this.#options[key] };
  }
}
