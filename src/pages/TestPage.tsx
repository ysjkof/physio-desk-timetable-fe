import { useReactiveVar } from '@apollo/client';
import { FormEvent, useState } from 'react';
import Loading from '../components/atoms/Loading';
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

const makeAccount = (email: string, name: string) => ({
  email,
  name,
  password: '123',
});
const makePatient = (name: string, clinicId: number) => ({
  name,
  clinicId,
  gender: Math.ceil(Math.random() * 2) === 1 ? 'male' : 'female',
  birthday: new Date('2002-10-13'),
});

const length = 10;
const arr: any[] = [];
arr.length = length;
arr.fill(0);
const accountArr = arr.map((_, idx) =>
  makeAccount(`test${idx}@t.co`, `치료사${idx}`)
);

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

function CreateReservation() {
  const [createdReservation, setCreatedReservation] = useState({
    totalCount: 0,
    thisCount: 0,
  });
  const { clinic } = useReactiveVar(selectedInfoVar);
  const clinicId = clinic?.id;
  if (!clinicId) return <Loading />;

  const { data: prescriptionsData } = useFindPrescriptionsQuery({
    variables: {
      input: {
        clinicId,
        onlyLookUpActive: false,
      },
    },
  });
  const { data: allPatients } = useFindAllPatientsQuery({
    variables: { input: { clinicId } },
  });
  const [createReservationMutation] = useCreateReservationMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const date = form.get('date') as string;

    if (!clinicId || !date) return console.warn('날짜와 병원 id가 잘못됐다.');

    const [year, month] = date.split('-');

    let prescriptions: PrescriptionWithSelect[] =
      prescriptionsData?.findPrescriptions.prescriptions!.map((presc) => ({
        ...presc,
        isSelect: false,
      })) ?? [];

    const firstDate = new Date(`${year}-${month}-1`);

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
          Math.random() * (clinic?.members.length ?? 0)
        );
        const patientId = patients[patientRandom].id;
        const userId = clinic?.members[memberRandon].user.id!;

        createReservationMutation({
          variables: {
            input: {
              startDate: time[0],
              endDate: time[1],
              patientId,
              userId,
              clinicId: +clinicId,
              prescriptionIds: [presc.id],
            },
          },
        });
      });
    }
    setCreatedReservation((prevValue) => ({
      thisCount: count,
      totalCount: prevValue.thisCount + count,
    }));
  };

  return (
    <div className="border p-2">
      <form className="mb-4 flex flex-col px-4" onSubmit={handleSubmit}>
        <h2>무작위 예약 만들기</h2>
        <label>
          날짜
          <input
            name="date"
            className="rounded-md border px-1"
            type="date"
            defaultValue={new Intl.DateTimeFormat('ko-KR')
              .format(new Date())
              .replaceAll('. ', '-')
              .replace('.', '')}
          ></input>
        </label>
        <button
          className="w-fit rounded-sm bg-gray-500 px-2 text-white"
          type="submit"
        >
          실행
        </button>
      </form>
      <p>
        병원 id: {clinic?.id}
        <br />
        병원이름 : {clinic?.name}
        <br />
        예약한 수 : {createdReservation.thisCount}
        <br />총 예약한 수 : {createdReservation.totalCount}
      </p>
    </div>
  );
}

function CreateDummyData() {
  const selectedInfo = useReactiveVar(selectedInfoVar);
  const [reserveDate, setReserveDate] = useState(new Date().getMonth() + 1);

  const clinicId = selectedInfo.clinic?.id;

  const [createAccount] = useCreateAccountMutation();
  const [createClinic] = useCreateClinicMutation();
  const [createPatient] = useCreatePatientMutation();
  const [createAtom] = useCreateAtomPrescriptionMutation();
  const [createPrescription] = useCreatePrescriptionMutation();

  return (
    <div className="px-4 ">
      <h1 className="text-base font-extrabold">Create Dummy Data</h1>
      <p>
        병원 id: {selectedInfo.clinic?.id}
        <br />
        병원이름 : {selectedInfo.clinic?.name}
        <br />
        예약될 월 : {reserveDate}
        <br />
      </p>
      <br />
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
          onClick={() => {
            if (!clinicId) throw new Error('clinicId false');
            arr
              .map((_, idx) => makePatient(`환자님${idx}`, clinicId))
              .forEach((acc) => {
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
              });
          }}
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
          onClick={() => {
            if (!clinicId) throw new Error('clinicId false');
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
            );
          }}
        >
          처방 만들기
        </button>
      </div>
      <CreateReservation />
    </div>
  );
}
