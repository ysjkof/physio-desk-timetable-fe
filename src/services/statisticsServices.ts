import {
  IDailyPrescription,
  IDailyPrescriptionWithCount,
  IDailyReport,
  IPrescriptionOfUser,
  MemberState,
} from "../pages/dashboard/organisms/statistics";

interface CombineUserStatistics {
  dailyReports: IDailyReport[];
  memberState?: MemberState[];
  prescriptions: IDailyPrescription[];
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

function combineUserStatistics({
  dailyReports,
  memberState,
  prescriptions,
}: CombineUserStatistics) {
  const flattening = (reports: IDailyReport[]) =>
    reports.map((day) => day.users).flat(1);

  const combineSameUser = (flatReports: ReturnType<typeof flattening>) => {
    const obj: ObjReport = {};
    class Prescription implements IDailyPrescriptionWithCount {
      count = 0;
      price = 0;
      requiredTime = 0;
      constructor(public readonly id: number, public readonly name: string) {
        id;
        name;
      }
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
        nextPrescriptions.forEach((prescription) => {
          const idx = prevPrescriptions.findIndex(
            (prevPrescription) => prevPrescription.id === prescription.id
          );
          if (idx !== -1) {
            prevPrescriptions[idx].count =
              prevPrescriptions[idx].count + prescription.count;
            prevPrescriptions[idx].price = 0;
            prevPrescriptions[idx].requiredTime = 0;
          }
        });
        return prevPrescriptions;
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
        if (!selectedPrescription) throw new Error("처방을 찾을 수 없습니다");
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
    const injectUserName = toArrReport.map(([userId, reports]) => {
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
    return injectUserName;
  };

  const objReport = combineSameUser(flattening(dailyReports));
  const arrReport = convertObjToArr(objReport);
  return arrReport.sort((a, b) => {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
  });
}

export default combineUserStatistics;
