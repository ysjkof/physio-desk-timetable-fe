import { TABLE_TIME_GAP } from '../constants/constants';
import {
  convertMinuteFromDate,
  createDate,
  get4DigitHour,
} from '../services/dateServices';
import localStorageUtils from '../utils/localStorageUtils';
import type {
  FirstAndLastTime,
  TableTimeOptions,
  UserIdAndName,
} from '../types/common.types';

export class TableTime {
  static #options = {
    firstHour: 9,
    firstMinute: 0,
    lastHour: 19,
    lastMinute: 0,
    gap: TABLE_TIME_GAP,
  };
  static #userIdAndName: UserIdAndName;
  static #localStorageUtil = localStorageUtils;

  static initialize(userIdAndName: UserIdAndName) {
    this.#userIdAndName = userIdAndName;
  }

  static setValue(tableTime: TableTimeOptions) {
    this.#options = tableTime;
  }

  static saveToLocalStorage(value: TableTimeOptions) {
    if (!this.#hasUserIdAndName) throw this.#initialError;

    this.#localStorageUtil.set({
      key: 'tableTime',
      value,
      ...this.#userIdAndName,
    });
  }

  static getFromLocalStorage() {
    if (!this.#hasUserIdAndName) throw this.#initialError;

    return this.#localStorageUtil.get<TableTimeOptions>({
      key: 'tableTime',
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

  static get firstTime() {
    return this.createSpecificTime(
      this.#options.firstHour,
      this.#options.firstMinute
    );
  }

  static get lastTime() {
    return this.createSpecificTime(
      this.#options.lastHour,
      this.#options.lastMinute
    );
  }

  static createSpecificTime(hour: number, minute: number) {
    return createDate(undefined, {
      hour,
      minute,
    });
  }

  static get firstTimeInMinute() {
    return convertMinuteFromDate(this.firstTime);
  }

  static get lastTimeInMinute() {
    return convertMinuteFromDate(this.lastTime);
  }

  static get labels() {
    return this.#timeGap().map((label) => get4DigitHour(label));
  }

  // 시작시각부터 끝시각까지 timeGap의 차이가 나는 Date배열을 만든다
  static #timeGap() {
    const labels = [];
    const start = this.firstTime;
    const end = this.lastTime;

    let i = 0;
    while (i < 1500) {
      if (start.valueOf() > end.valueOf()) i = 1500;

      const date = new Date(start);
      const labelRow = date;
      labels.push(labelRow);
      const getMinutes = start.getMinutes();
      start.setMinutes(getMinutes + this.#options.gap);
      i++;
    }

    return labels;
  }

  static createTimeOptions(key: keyof FirstAndLastTime, value: number) {
    let result = { ...this.value, [key]: value };
    if (key === 'firstHour' && value >= this.value.lastHour) {
      result.lastHour++;
    }
    return result;
  }
}
