import { TABLE_TIME_GAP } from '../constants/constants';
import {
  convertMinuteFromDate,
  createDate,
  get4DigitHour,
} from '../utils/date.utils';
import localStorageUtils from '../utils/localStorage.utils';
import type {
  FirstAndLastTime,
  TableTimeOptions,
  UserIdAndName,
} from '../types/common.types';

export class TimeDurationOfTimetable {
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
    const localViewOptions = this.#getFromLocalStorage();
    if (localViewOptions === null) {
      this.saveToLocalStorage(this.#options);
      return this.get();
    }
    this.set(localViewOptions);
    return this.get();
  }

  static set(tableTime: TableTimeOptions) {
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

  static #getFromLocalStorage() {
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

  static get() {
    return this.#options;
  }

  static getFirstTime() {
    return this.createSpecificTime(
      this.#options.firstHour,
      this.#options.firstMinute
    );
  }

  static getLastTime() {
    return this.createSpecificTime(
      this.#options.lastHour,
      this.#options.lastMinute
    );
  }

  static getHours() {
    const hours: number[] = [];
    const { firstHour, lastHour, lastMinute } = this.#options;
    for (let i = firstHour; i < lastHour; i += 1) {
      hours.push(i);
    }
    if (lastMinute !== 0) hours.push(lastHour);
    return hours;
  }

  static getMinutes() {
    const minutes: number[] = [];
    const MINUTE_OF_ONE_HOUR = 60;
    const minutesLength = MINUTE_OF_ONE_HOUR / this.#options.gap;
    for (let i = 0; i < minutesLength; i += 1) {
      minutes.push(i * this.#options.gap);
    }
    return minutes;
  }

  static createSpecificTime(hour: number, minute: number) {
    return createDate(undefined, {
      hour,
      minute,
    });
  }

  static getFirstTimeInMinute() {
    return convertMinuteFromDate(this.getFirstTime());
  }

  static getLastTimeInMinute() {
    return convertMinuteFromDate(this.getLastTime());
  }

  static getLabels() {
    return this.#timeGap().map((label) => get4DigitHour(label));
  }

  // 시작시각부터 끝시각까지 timeGap의 차이가 나는 Date배열을 만든다
  static #timeGap() {
    const labels = [];
    const start = this.getFirstTime();
    const end = this.getLastTime();

    let i = 0;
    while (i < 1500) {
      if (start.valueOf() > end.valueOf()) i = 1500;

      const date = new Date(start);
      const labelRow = date;
      labels.push(labelRow);
      const getMinutes = start.getMinutes();
      start.setMinutes(getMinutes + this.#options.gap);
      i += 1;
    }

    return labels;
  }

  static createTimeOptions(key: keyof FirstAndLastTime, value: number) {
    const result = { ...this.#options, [key]: value };
    if (key === 'firstHour' && value >= this.#options.lastHour) {
      result.lastHour += 1;
    }
    return result;
  }
}
