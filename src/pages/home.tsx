import { useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { isLoggedInVar } from "../apollo";
import {
  useCreateAccountMutation,
  useCreateAtomPrescriptionMutation,
  useCreateClinicMutation,
  useCreatePatientMutation,
  useCreatePrescriptionMutation,
  useCreateReservationMutation,
  useFindAllPatientsQuery,
  useFindPrescriptionsQuery,
  useInviteClinicMutation,
} from "../graphql/generated/graphql";
import {
  loggedInUserVar,
  PrescriptionWithSelect,
  selectedClinicVar,
} from "../store";

const clinicId = 23;
const makeAccount = (email: string, name: string) => ({
  email,
  name,
  password: "123",
});
const makePatient = (name: string) => ({
  name,
  clinicId,
  gender: Math.ceil(Math.random() * 2) === 1 ? "male" : "female",
  birthday: new Date("1980-1-1"),
});

const length = 10;
const arr: any[] = [];
arr.length = length;
arr.fill(0);
const accountArr = arr.map((_, idx) =>
  makeAccount(`test${idx}@t.co`, `치료사${idx}`)
);

const patientArr = arr.map((_, idx) => makePatient(`환자님${idx}`));
const newPrescriptions = [
  { name: "MT1", price: 80000, requiredTime: 30, prescriptionAtomIds: [1] },
  { name: "MT2", price: 130000, requiredTime: 50, prescriptionAtomIds: [1] },
  { name: "ET1", price: 40000, requiredTime: 10, prescriptionAtomIds: [2] },
  { name: "ET1", price: 80000, requiredTime: 10, prescriptionAtomIds: [2] },
].map(({ name, prescriptionAtomIds, price, requiredTime }) => ({
  name,
  prescriptionAtomIds,
  price,
  requiredTime,
}));

function getOneDayReservationInputDateForTest(
  inputStartDate: Date,
  inputPresc: { id: number; requiredTime: number; name: string }
) {
  const numberOfReservationsPerDay = Math.floor(Math.random() * 8);
  const startDate = new Date(inputStartDate);
  const dates: Date[] = [];
  dates.length = numberOfReservationsPerDay;
  dates.fill(startDate);

  return dates.map((d) => {
    const sd = new Date(d);
    const ed = new Date(d);
    let th = Math.floor(Math.random() * (19 - 9) + 9);
    let tm = Math.floor(Math.random() * 6) * 10;
    while (dates.find((dateInWhile) => dateInWhile.getHours() === th)) {
      th = Math.floor(Math.random() * (19 - 9) + 9);
    }
    tm === 6 ? (tm = 0) : "";
    sd.setHours(th, tm, 0, 0);
    ed.setHours(th, tm + inputPresc.requiredTime, 0, 0);
    return [sd, ed];
  });
}
function selectPrescriptionForTest(inputPresc: PrescriptionWithSelect[]) {
  const selected = inputPresc[Math.floor(Math.random() * inputPresc.length)];
  return {
    id: selected?.id,
    name: selected?.name,
    requiredTime: selected?.requiredTime,
  };
}

export function Home() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const selectedClinic = useReactiveVar(selectedClinicVar);

  const [createAccount] = useCreateAccountMutation();
  const [createClinic] = useCreateClinicMutation();
  const [createPatient] = useCreatePatientMutation();
  const [inviteClinic] = useInviteClinicMutation();
  const [createAtom] = useCreateAtomPrescriptionMutation();
  const [createPrescription] = useCreatePrescriptionMutation();
  const [createReservationMutation] = useCreateReservationMutation();
  const { data: allPatients } = useFindAllPatientsQuery({
    variables: { input: { clinicId: selectedClinic?.id ?? 0 } },
  });

  const { data: prescriptionsData } = useFindPrescriptionsQuery({
    variables: {
      input: {
        clinicId: selectedClinic?.id ?? 0,
        onlyLookUpActive: false,
      },
    },
  });

  let prescriptions: PrescriptionWithSelect[] =
    prescriptionsData?.findPrescriptions.prescriptions!.map((presc) => ({
      ...presc,
      isSelect: false,
    })) ?? [];

  function createDummyReserve() {
    const firstDate = new Date("2022-7-1");
    let count = 0;
    for (let i = 0; i < 30; i++) {
      firstDate.setDate(i + 1);
      const presc = selectPrescriptionForTest(prescriptions);
      const times = getOneDayReservationInputDateForTest(firstDate, presc);
      count = count + times.length;

      const patients = allPatients?.findAllPatients.results!;

      times.forEach((time) => {
        const patientRandom = Math.floor(
          Math.random() * (patients?.length! ?? 0)
        );
        const memberRandon = Math.floor(
          Math.random() * (selectedClinic?.members.length ?? 0)
        );
        const patientId = patients[patientRandom].id;
        const userId = selectedClinic?.members[memberRandon].user.id!;

        createReservationMutation({
          variables: {
            input: {
              startDate: time[0],
              endDate: time[1],
              patientId,
              userId,
              clinicId: selectedClinic!.id,
              prescriptionIds: [presc.id],
            },
          },
        });
      });
    }
    console.log("총 생성된 예약 : ", count);
  }

  return (
    <div className="px-4 ">
      <h1 className="font-bold">무울 Muool</h1>
      <h2 className="mt-4  font-medium">무울에 오신 걸 환영합니다</h2>
      <p className="mt-2">
        무울은 물리치료사의 예약 관리 시스템입니다. 점점 용량이 커지고,
        느려지고, 못생긴 스프레드 시트. 마찬가지로 느리고 통계를 보기 어려운
        전자차트 프로그램. 일정한 틀이 없고, 통계 확인이 불가능한 환자 차트. 이
        문제점을 해결하려고 만듭니다.
      </p>
      <p className="mt-2  ">여기에 랜딩페이지가 만들어질 것입니다.</p>
      {isLoggedIn && (
        <div className="mt-2 space-x-4">
          <Link
            className="rounded-lg border px-2 py-1 text-sky-400"
            to="/list-patient"
          >
            List Patient
          </Link>
        </div>
      )}

      <div className="flex gap-4 pt-10">
        <button
          onClick={() =>
            accountArr.forEach((acc) => {
              const { email, name, password } = acc;
              createAccount({
                variables: {
                  input: {
                    email,
                    name,
                    password,
                  },
                },
              });
            })
          }
        >
          계정생성
        </button>
        <button
          onClick={() =>
            createClinic({
              variables: {
                input: {
                  name: "테스트정형외과의원",
                },
              },
            })
          }
        >
          병원생성
        </button>
        <button
          onClick={() =>
            patientArr.forEach((acc) => {
              const { clinicId, name, gender, birthday } = acc;

              createPatient({
                variables: {
                  input: {
                    name,
                    clinicId,
                    gender,
                    birthday,
                  },
                },
              });
            })
          }
        >
          환자생성
        </button>
        <button
          onClick={() =>
            inviteClinic({
              variables: {
                input: {
                  clinicId,
                  userIds: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
                },
              },
            })
          }
        >
          치료사 초대
        </button>
        <button
          onClick={() =>
            ["도수치료", "충격파"].forEach((name) =>
              createAtom({
                variables: {
                  input: {
                    name,
                  },
                },
              })
            )
          }
        >
          아톰 만들기
        </button>
        <button
          onClick={() =>
            newPrescriptions.forEach(
              ({ name, prescriptionAtomIds, price, requiredTime }) =>
                createPrescription({
                  variables: {
                    input: {
                      clinicId,
                      name,
                      prescriptionAtomIds,
                      price,
                      requiredTime,
                    },
                  },
                })
            )
          }
        >
          처방 만들기
        </button>
        <button onClick={() => createDummyReserve()}>무작위 예약 만들기</button>
      </div>
    </div>
  );
}
