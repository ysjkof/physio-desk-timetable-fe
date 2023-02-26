import { eachDayOfInterval, endOfMonth, startOfMonth } from 'date-fns';
import { PrimaryCountList } from '../../src/types/commonTypes';

const prescriptions = [
  {
    __typename: 'getStatisticsOutputPrescription',
    id: 1,
    name: '도수30',
    count: 2,
  },
  {
    __typename: 'getStatisticsOutputPrescription',
    id: 2,
    name: '도수60',
    count: 2,
  },
];
const reservations = [
  {
    __typename: 'Reservation',
    prescriptions: [
      {
        __typename: 'Prescription',
        id: 1,
        name: '도수30',
        price: 70000,
        requiredTime: 30,
      },
    ],
    patient: {
      __typename: 'Patient',
      id: 43,
      name: '환자삼',
    },
    lastModifier: {
      __typename: 'User',
      id: 1,
      name: '이성진',
    },
    id: 130,
    startDate: '2023-02-25T02:50:00.000Z',
    endDate: '2023-02-25T03:20:00.000Z',
    state: 'Reserved',
    memo: null,
    isFirst: false,
  },
  {
    __typename: 'Reservation',
    prescriptions: [
      {
        __typename: 'Prescription',
        id: 2,
        name: '도수60',
        price: 130000,
        requiredTime: 60,
      },
    ],
    patient: {
      __typename: 'Patient',
      id: 51,
      name: '공공일',
    },
    lastModifier: {
      __typename: 'User',
      id: 1,
      name: '이성진',
    },
    id: 137,
    startDate: '2023-02-25T03:50:00.000Z',
    endDate: '2023-02-25T04:50:00.000Z',
    state: 'Reserved',
    memo: null,
    isFirst: true,
  },
  {
    __typename: 'Reservation',
    prescriptions: [
      {
        __typename: 'Prescription',
        id: 1,
        name: '도수30',
        price: 70000,
        requiredTime: 30,
      },
    ],
    patient: {
      __typename: 'Patient',
      id: 50,
      name: '환자십',
    },
    lastModifier: {
      __typename: 'User',
      id: 1,
      name: '이성진',
    },
    id: 177,
    startDate: '2023-02-25T05:00:00.000Z',
    endDate: '2023-02-25T05:30:00.000Z',
    state: 'Reserved',
    memo: null,
    isFirst: false,
  },
  {
    __typename: 'Reservation',
    prescriptions: [
      {
        __typename: 'Prescription',
        id: 2,
        name: '도수60',
        price: 130000,
        requiredTime: 60,
      },
    ],
    patient: {
      __typename: 'Patient',
      id: 56,
      name: '공공육',
    },
    lastModifier: {
      __typename: 'User',
      id: 1,
      name: '이성진',
    },
    id: 96,
    startDate: '2023-02-25T05:40:00.000Z',
    endDate: '2023-02-25T06:40:00.000Z',
    state: 'Reserved',
    memo: null,
    isFirst: true,
  },
  {
    __typename: 'Reservation',
    prescriptions: [
      {
        __typename: 'Prescription',
        id: 1,
        name: '도수30',
        price: 70000,
        requiredTime: 30,
      },
    ],
    patient: {
      __typename: 'Patient',
      id: 62,
      name: '공일이',
    },
    lastModifier: {
      __typename: 'User',
      id: 1,
      name: '이성진',
    },
    id: 151,
    startDate: '2023-02-25T07:00:00.000Z',
    endDate: '2023-02-25T07:30:00.000Z',
    state: 'NoShow',
    memo: null,
    isFirst: false,
  },
  {
    __typename: 'Reservation',
    prescriptions: [
      {
        __typename: 'Prescription',
        id: 1,
        name: '도수30',
        price: 70000,
        requiredTime: 30,
      },
    ],
    patient: {
      __typename: 'Patient',
      id: 42,
      name: '환자이',
    },
    lastModifier: {
      __typename: 'User',
      id: 1,
      name: '이성진',
    },
    id: 187,
    startDate: '2023-02-25T08:20:00.000Z',
    endDate: '2023-02-25T08:50:00.000Z',
    state: 'NoShow',
    memo: null,
    isFirst: false,
  },
  {
    __typename: 'Reservation',
    prescriptions: [
      {
        __typename: 'Prescription',
        id: 1,
        name: '도수30',
        price: 70000,
        requiredTime: 30,
      },
    ],
    patient: {
      __typename: 'Patient',
      id: 60,
      name: '공일공',
    },
    lastModifier: {
      __typename: 'User',
      id: 1,
      name: '이성진',
    },
    id: 103,
    startDate: '2023-02-25T09:40:00.000Z',
    endDate: '2023-02-25T10:10:00.000Z',
    state: 'NoShow',
    memo: null,
    isFirst: false,
  },
];
const createUserInDailyReport = (userId: number, date: Date, idx: number) => {
  const day = date.getDate();

  return {
    __typename: 'UserInDailyReport',
    userId,
    reservationCount: day * userId,
    noshow: userId,
    cancel: userId + idx,
    newPatient: day - userId,
    visitMoreThanThirty: 0,
    visitMoreThanSixty: 0,
    visitMoreThanNinety: 0,
    prescriptions, // 사용할 수 없는 값임. 사용할 때 수정요함
    reservations, // 사용할 수 없는 값임. 사용할 때 수정요함
  };
};

const DATE = '2023-02-28';

const eachDayOfMonth = eachDayOfInterval({
  start: startOfMonth(new Date(DATE)),
  end: endOfMonth(new Date(DATE)),
});

const userIds = [1, 2, 3, 4, 5];

export const dailyReports = eachDayOfMonth.map((date, idx) => {
  return {
    date,
    users: userIds.map((id) => createUserInDailyReport(id, date, idx)),
  };
});

export const result: PrimaryCountList = {};
userIds.forEach((id) => {
  const reservationCount = eachDayOfMonth.reduce(
    (acc, cur) => acc + cur.getDate() * id,
    0
  );
  const noshow = eachDayOfMonth.reduce((acc) => acc + id, 0);
  const cancel = eachDayOfMonth.reduce((acc, cur, idx) => acc + id + idx, 0);
  const newPatient = eachDayOfMonth.reduce(
    (acc, cur, idx) => acc + cur.getDate() - id,
    0
  );

  result[id] = {
    reservationCount: result[id]?.reservationCount || 0 + reservationCount,
    noshow: result[id]?.noshow || 0 + noshow,
    cancel: result[id]?.cancel || 0 + cancel,
    newPatient: result[id]?.newPatient || 0 + newPatient,
  };
});
