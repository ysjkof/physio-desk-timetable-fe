import { TimeLabelArg } from '../types/common.types';

export class TimeLabel {
  value: string;
  color: string;
  isShow: boolean;

  constructor({ label, visibleMinute, colors }: TimeLabelArg) {
    this.value = label;
    this.isShow = this.#setShow(visibleMinute);
    this.color = this.isShow ? this.#setColor(visibleMinute, colors) : '';
  }

  #setShow(visibleMinute: TimeLabelArg['visibleMinute']) {
    return !!visibleMinute.find((minute) => this.value.endsWith(minute));
  }

  #setColor(
    visibleMinute: TimeLabelArg['visibleMinute'],
    colors: TimeLabelArg['colors']
  ) {
    const index = visibleMinute.findIndex((minute) =>
      this.value.endsWith(minute)
    );
    return colors[index];
  }
}
