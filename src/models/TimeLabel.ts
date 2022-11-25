export class TimeLabel {
  #label: string;
  #minute: string;
  #color: string;
  #isShow: boolean;

  #colors = {
    '00': '#333779',
    '30': '#DDDDEF',
  };

  constructor(label: string, private readonly showMinutes: string[]) {
    this.#label = label;
    this.#minute = label.substring(3, 5);
    this.#color = this.#setColor();
    this.#isShow = this.#setShow(showMinutes);
  }

  #setShow(showMinutes: string[]) {
    const [exist] = showMinutes.filter((_minute) =>
      this.#minute.endsWith(_minute)
    );
    return !!exist;
  }

  #setColor() {
    if (this.#minute === '00' || this.#minute === '30') {
      return this.#colors[this.#minute];
    }
    return '';
  }

  get value() {
    return this.#label;
  }

  get color() {
    return this.#color;
  }

  get isShow() {
    return this.#isShow;
  }
}
