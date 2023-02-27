import type {
  IDailyPrescriptionWithCount,
  IPrescriptionOfUser,
  MemberState,
  CountListOfEachUser,
  ObjValueIsNumber,
} from '../types/commonTypes';
import type {
  PrescriptionOfGetStatistics,
  DailyReportOfGetStatistics,
  DailyReportsOfGetStatistics,
} from '../types/processedGeneratedTypes';

interface CombineUserStatistics {
  dailyReports: DailyReportOfGetStatistics[];
  memberState?: MemberState[];
  prescriptions: PrescriptionOfGetStatistics[];
}

interface ObjReport {
  [key: string]: {
    reservationCount: number;
    newPatient: number;
    noshow: number;
    cancel: number;
    visitMoreThanThirty: number;
    prescriptions: IDailyPrescriptionWithCount[];
  };
}

export const createUserStatistics = ({
  dailyReports,
  memberState,
  prescriptions,
}: CombineUserStatistics) => {
  const flattening = (reports: DailyReportOfGetStatistics[]) =>
    reports.map((day) => day.users).flat(1);

  const combineSameUser = (flatReports: ReturnType<typeof flattening>) => {
    const obj: ObjReport = {};
    class Prescription implements IDailyPrescriptionWithCount {
      count = 0;

      price = 0;

      requiredTime = 0;

      constructor(public readonly id: number, public readonly name: string) {}
    }

    flatReports.forEach((user) => {
      const userKey = user.userId;
      const nextPrescription = user.prescriptions;

      const makePrescriptionList = (): IDailyPrescriptionWithCount[] =>
        prescriptions.map(
          (prescription) => new Prescription(prescription.id, prescription.name)
        );

      const injectCountToPrescriptions = (
        prevPrescriptions: IDailyPrescriptionWithCount[],
        nextPrescriptions: IPrescriptionOfUser[]
      ) => {
        const prescriptionsWithCount = structuredClone(prevPrescriptions);
        nextPrescriptions.forEach((prescription) => {
          const idx = prevPrescriptions.findIndex(
            (prevPrescription) => prevPrescription.id === prescription.id
          );
          if (idx !== -1) {
            prescriptionsWithCount[idx].count =
              prevPrescriptions[idx].count + prescription.count;
            prescriptionsWithCount[idx].price = 0;
            prescriptionsWithCount[idx].requiredTime = 0;
          }
        });
        return prescriptionsWithCount;
      };

      const prevPrescriptions = obj[userKey]
        ? obj[userKey].prescriptions
        : makePrescriptionList();

      const injectedPriceAndRequiredTimeAndCount = injectCountToPrescriptions(
        prevPrescriptions,
        nextPrescription
      ).map((prescription) => {
        const selectedPrescription = prescriptions.find(
          (prescriptionInList) => prescriptionInList.id === prescription.id
        );
        if (!selectedPrescription) throw new Error('처방을 찾을 수 없습니다');
        return {
          ...prescription,
          price: prescription.count * selectedPrescription.price,
          requiredTime: prescription.count * selectedPrescription.requiredTime,
        };
      });

      if (obj[userKey]) {
        obj[userKey] = {
          reservationCount:
            obj[userKey].reservationCount + user.reservationCount,
          newPatient: obj[userKey].newPatient + user.newPatient,
          noshow: obj[userKey].noshow + user.noshow,
          cancel: obj[userKey].cancel + user.cancel,
          visitMoreThanThirty:
            obj[userKey].visitMoreThanThirty + user.visitMoreThanThirty,
          prescriptions: injectedPriceAndRequiredTimeAndCount,
        };
      } else {
        obj[userKey] = {
          reservationCount: user.reservationCount,
          newPatient: user.newPatient,
          noshow: user.noshow,
          cancel: user.cancel,
          visitMoreThanThirty: user.visitMoreThanThirty,
          prescriptions: injectedPriceAndRequiredTimeAndCount,
        };
      }
    });

    return obj;
  };

  const convertObjToArr = (objReport: ReturnType<typeof combineSameUser>) => {
    const toArrReport = Object.entries(objReport);
    const injectedUserName = toArrReport.map(([userId, reports]) => {
      function injectUserName() {
        const member = memberState?.find((member) => member.userId === +userId);
        return member ? member.name : userId;
      }
      const {
        reservationCount,
        newPatient,
        noshow,
        cancel,
        visitMoreThanThirty,
        prescriptions,
      } = reports;

      return {
        name: injectUserName(),
        counts: {
          reservationCount,
          newPatient,
          noshow,
          cancel,
          visitMoreThanThirty,
        },
        prescriptions,
      };
    });
    return injectedUserName;
  };

  const objReport = combineSameUser(flattening(dailyReports));
  const arrReport = convertObjToArr(objReport);
  return arrReport.sort((a, b) => {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
  });
};

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
