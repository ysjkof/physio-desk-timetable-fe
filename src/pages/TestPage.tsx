import { useReactiveVar } from '@apollo/client';
import {
  useCreateAccountMutation,
  useCreateAtomPrescriptionMutation,
  useCreateClinicMutation,
  useCreatePatientMutation,
  useCreatePrescriptionMutation,
  useCreateReservationMutation,
  useFindAllPatientsQuery,
  useFindPrescriptionsQuery,
} from '../graphql/generated/graphql';
import { selectedInfoVar } from '../store';
import { PrescriptionWithSelect } from '../types/type';

export default function TestPage() {
  return (
    <div className="px-4 ">
      <h1 className="text-base font-extrabold">TEST PAGE</h1>
      <div className="flex h-[500px]"></div>

      {/* 이하 더미 자료 만드는 곳 */}
      <CreateDummyData />
    </div>
  );
}

const clinicId = 11;
const makeAccount = (email: string, name: string) => ({
  email,
  name,
  password: '123',
});
const makePatient = (name: string) => ({
  name,
  clinicId,
  gender: Math.ceil(Math.random() * 2) === 1 ? 'male' : 'female',
  birthday: new Date('1980-1-1'),
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
  { name: 'MT1', price: 80000, requiredTime: 30, prescriptionAtomIds: [1] },
  { name: 'MT2', price: 130000, requiredTime: 50, prescriptionAtomIds: [1] },
  { name: 'ET1', price: 40000, requiredTime: 10, prescriptionAtomIds: [2] },
  { name: 'ET1', price: 80000, requiredTime: 10, prescriptionAtomIds: [2] },
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
    tm === 6 ? (tm = 0) : '';
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

export function CreateDummyData() {
  const selectedInfo = useReactiveVar(selectedInfoVar);

  const [createAccount] = useCreateAccountMutation();
  const [createClinic] = useCreateClinicMutation();
  const [createPatient] = useCreatePatientMutation();
  const [createAtom] = useCreateAtomPrescriptionMutation();
  const [createPrescription] = useCreatePrescriptionMutation();
  const [createReservationMutation] = useCreateReservationMutation();
  const { data: allPatients } = useFindAllPatientsQuery({
    variables: { input: { clinicId: selectedInfo.clinic?.id ?? 0 } },
  });

  const { data: prescriptionsData } = useFindPrescriptionsQuery({
    variables: {
      input: {
        clinicId: selectedInfo.clinic?.id ?? 0,
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
    const firstDate = new Date('2022-7-1');
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
          Math.random() * (selectedInfo.clinic?.members.length ?? 0)
        );
        const patientId = patients[patientRandom].id;
        const userId = selectedInfo.clinic?.members[memberRandon].user.id!;

        createReservationMutation({
          variables: {
            input: {
              startDate: time[0],
              endDate: time[1],
              patientId,
              userId,
              clinicId: selectedInfo.clinic!.id,
              prescriptionIds: [presc.id],
            },
          },
        });
      });
    }
    console.log('총 생성된 예약 : ', count);
  }

  return (
    <div className="px-4 ">
      <h1 className="text-base font-extrabold">Create Dummy Data</h1>
      <div className="flex gap-4">
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
                  name: '테스트정형외과의원',
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
        <button onClick={() => {}}>치료사 초대</button>
        <button
          onClick={() =>
            ['도수치료', '충격파'].forEach((name) =>
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
