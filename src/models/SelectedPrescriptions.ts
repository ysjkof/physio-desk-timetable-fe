import { SelectedPrescription } from '../types/common.types';
import { Prescription } from '../types/generated.types';

type Prescriptions = Prescription[] | null | undefined;

export class SelectedPrescriptions {
  #prescriptions: Prescription[];

  #list: SelectedPrescription = {
    minute: 0,
    price: 0,
    prescriptions: [],
  };

  constructor(prescriptions: Prescriptions) {
    this.#prescriptions = prescriptions || [];
  }

  get() {
    return this.#list;
  }

  getNames() {
    return this.#list.prescriptions
      .map(
        (id) =>
          this.#prescriptions.find((prescription) => prescription.id === id)
            ?.name || ''
      )
      .join(' / ');
  }

  toggleById(id: number) {
    const exist = this.#list.prescriptions.find((_id) => _id === id);
    const freshPrescriptions = exist
      ? this.#list.prescriptions.filter((_id) => _id !== id)
      : [...this.#list.prescriptions, id];
    this.#list.prescriptions = freshPrescriptions;
    this.#refreshList(freshPrescriptions);
    return this;
  }

  #refreshList(ids: number[]) {
    const { price, minute } = this.#getTotalPriceAndMinute(ids);
    this.#list.minute = minute;
    this.#list.price = price;
  }

  #getTotalPriceAndMinute(ids: SelectedPrescription['prescriptions']) {
    let price = 0;
    let minute = 0;
    ids.forEach((id) => {
      const prescription = this.#prescriptions.find(
        (prescription) => prescription.id === id
      );
      if (!prescription) return;
      price += prescription.price;
      minute += prescription.requiredTime;
    });
    return { price, minute };
  }
}
