import type {
  CountListOfEachUser,
  ObjValueIsNumber,
} from '../types/commonTypes';
import type { DailyReportsOfGetStatistics } from '../types/processedGeneratedTypes';

export const getReportsByUser = (dailyReports: DailyReportsOfGetStatistics) => {
  const reportsByUser: CountListOfEachUser = {};

  dailyReports?.forEach((report) => {
    const { users } = report;

    users.forEach((user) => {
      const { cancel, newPatient, noshow, reservationCount } = user;
      const prevValue = reportsByUser[user.userId];

      reportsByUser[user.userId] = {
        cancel: (prevValue?.cancel || 0) + cancel,
        newPatient: (prevValue?.newPatient || 0) + newPatient,
        noshow: (prevValue?.noshow || 0) + noshow,
        reservationCount: (prevValue?.reservationCount || 0) + reservationCount,
      };
    });
  });

  return reportsByUser;
};

export const sumObjValue = <T extends ObjValueIsNumber>(
  obj1: T,
  obj2: T
): T => {
  const result: T = {} as T;
  for (let key in obj1) {
    result[key] = ((obj1[key] || 0) + obj2[key]) as T[Extract<keyof T, string>];
  }
  return result;
};
