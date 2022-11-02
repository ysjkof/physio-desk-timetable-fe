export class TimeLabel {
  private color: string;
  private isShow: boolean;
  private minute: string;

  constructor(readonly label: string, private readonly showMinutes: string[]) {
    this.minute = label.substring(3, 5);
    this.isShow = this.setShow();
    this.color = this.setColor();
  }

  private setShow() {
    const [exist] = this.showMinutes.filter((_minute) =>
      this.minute.endsWith(_minute)
    );

    return !!exist;
  }

  private setColor() {
    const colors = {
      '00': '#333779',
      '30': '#DDDDEF',
    };

    if (this.minute === '00' || this.minute === '30') {
      return colors[this.minute];
    }

    return '';
  }

  getColor() {
    return this.color;
  }
  getIsShow() {
    return this.isShow;
  }
}
