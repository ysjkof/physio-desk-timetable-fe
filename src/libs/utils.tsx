import {
  Patient,
  Reservation,
  ReservationState,
  User,
} from "../graphql/generated/graphql";
import { ONE_WEEK } from "../variables";

// interface ModefiedPatient extends Pick<Patient, "name" | "gender"> {}
// interface ModefiedPatient
//   extends Omit<Patient, "registrationNumber" | "birthday"> {}
// interface lastModifier extends Pick<User, "email"> {}

// interface Memo extends Omit<Reservation, "memo"> {}
// interface ModefiedReservation
//   extends Pick<Reservation, "id" | "startDate" | "endDate" | "state"> {
//   patiert: ModefiedPatient;
//   lastModifier: lastModifier;
//   memo: Memo;
// }

// class Day {
//   date: Date;
//   reservations: ModefiedReservation[];
//   timezones: [];
//   constructor(
//     date: Date,
//     reservations: ModefiedReservation[] = [],
//     timezones = []
//   ) {
//     this.date = date;
//     this.reservations = reservations;
//     this.timezones = [];
//   }
// }

export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

// export const getWeeksDate = (date: Date) => {
//   const weeks = [];
//   const newDate = new Date(date);
//   const inputDate = newDate.getDate();
//   const inputDay = newDate.getDay();
//   const firstDate = new Date(newDate.setDate(inputDate - inputDay));
//   for (let i = 0; i < ONE_WEEK; i++) {
//     let loopDate = new Date(firstDate);
//     loopDate = new Date(loopDate.setDate(loopDate.getDate() + i));
//     const day = new Day(loopDate);
//     weeks.push(day);
//   }
//   return weeks;
// };

// export function getDateOfMonth(value: Date) {
//   let result = [];
//   const firstDate = new Date(value);
//   const lastDate = new Date(firstDate);
//   firstDate.setDate(1);
//   lastDate.setMonth(lastDate.getMonth() + 1);
//   lastDate.setDate(0);
//   for (let i = 1; i <= lastDate.getDate(); i++) {
//     const date = new Date(firstDate);
//     date.setDate(+i);
//     result.push(date);
//   }
//   return result;
// }
