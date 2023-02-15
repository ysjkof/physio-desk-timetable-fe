import { useMutation, useQuery } from '@apollo/client';
import { FormEvent, useState } from 'react';
import {
  CREATE_ACCOUNT_DOCUMENT,
  CREATE_ATOM_PRESCRIPTION_DOCUMENT,
  CREATE_CLINIC_DOCUMENT,
  CREATE_PATIENT_DOCUMENT,
  CREATE_RESERVATION_DOCUMENT,
  FIND_ALL_PATIENTS_DOCUMENT,
  FIND_PRESCRIPTIONS_DOCUMENT,
} from '../graphql';
import { ClinicsOfClient } from '../models';
import { PrescriptionWithSelect } from '../types/commonTypes';
import type {
  CreateAccountMutation,
  CreateAtomPrescriptionMutation,
  CreateClinicMutation,
  CreatePatientMutation,
  CreatePrescriptionMutation,
  CreateReservationMutation,
  FindAllPatientsQuery,
  FindPrescriptionsQuery,
} from '../types/generatedTypes';
import { useGetClinic } from '../hooks';

export default function TestPage() {
  return (
    <div className="px-4 ">
      <h1 className="text-base font-extrabold">TEST PAGE</h1>
      <div className="flex h-[500px]" />

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
const arr: unknown[] = [];
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
  inputPrescription: { id: number; requiredTime: number; name: string }
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
    if (tm === 6) tm = 0;
    sd.setHours(th, tm, 0, 0);
    ed.setHours(th, tm + inputPrescription.requiredTime, 0, 0);
    return [sd, ed];
  });
}
function selectPrescriptionForTest(
  inputPrescription: PrescriptionWithSelect[]
) {
  const selected =
    inputPrescription[Math.floor(Math.random() * inputPrescription.length)];
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
  const selectedClinic = ClinicsOfClient.getSelectedClinic();
  const clinicId = selectedClinic.id;

  const { data: prescriptionsData } = useQuery<FindPrescriptionsQuery>(
    FIND_PRESCRIPTIONS_DOCUMENT,
    {
      variables: {
        input: {
          clinicId,
          onlyLookUpActive: false,
        },
      },
    }
  );
  const { data: allPatients } = useQuery<FindAllPatientsQuery>(
    FIND_ALL_PATIENTS_DOCUMENT,
    {
      variables: { input: { clinicId } },
    }
  );
  const [createReservationMutation] = useMutation<CreateReservationMutation>(
    CREATE_RESERVATION_DOCUMENT
  );

  if (!clinicId) return <p>로그인 해야 됩니다.</p>;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const date = form.get('date') as string;

    if (!clinicId || !date) return console.warn('날짜와 병원 id가 잘못됐다.');

    const [year, month] = date.split('-');

    const prescriptions: PrescriptionWithSelect[] =
      prescriptionsData?.findPrescriptions.prescriptions?.map(
        (prescription) => ({
          ...prescription,
          isSelect: false,
        })
      ) || [];

    const firstDate = new Date(`${year}-${month}-1`);

    let count = 0;
    for (let i = 0; i < 30; i += 1) {
      firstDate.setDate(i + 1);
      const prescription = selectPrescriptionForTest(prescriptions);
      const times = getOneDayReservationInputDateForTest(
        firstDate,
        prescription
      );
      count = count + times.length;

      const patients = allPatients?.findAllPatients.results;

      if (!patients) throw new Error('patients가 없습니다.');

      times.forEach((time) => {
        const patientRandom = Math.floor(
          Math.random() * (patients.length || 0)
        );
        const memberRandom = Math.floor(
          Math.random() * (selectedClinic.members.length || 0)
        );
        const patientId = patients[patientRandom].id;
        const userId = selectedClinic.members[memberRandom].user.id;

        createReservationMutation({
          variables: {
            input: {
              startDate: time[0],
              endDate: time[1],
              patientId,
              userId,
              clinicId: Number(clinicId),
              prescriptionIds: [prescription.id],
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
        <label htmlFor="test-page-date">
          날짜
          <input
            id="test-page-date"
            name="date"
            className="rounded-md border px-1"
            type="date"
            defaultValue={new Intl.DateTimeFormat('ko-KR')
              .format(new Date())
              .replaceAll('. ', '-')
              .replace('.', '')}
          />
        </label>
        <button
          className="w-fit rounded-sm bg-gray-500 px-2 text-white"
          type="submit"
        >
          실행
        </button>
      </form>
      <p>
        병원 id: {clinicId}
        <br />
        병원이름 : {selectedClinic.name}
        <br />
        예약한 수 : {createdReservation.thisCount}
        <br />총 예약한 수 : {createdReservation.totalCount}
      </p>
    </div>
  );
}

function CreateDummyData() {
  const [clinic] = useGetClinic();

  const [reserveDate] = useState(new Date().getMonth() + 1);

  const [createAccount] = useMutation<CreateAccountMutation>(
    CREATE_ACCOUNT_DOCUMENT
  );
  const [createClinic] = useMutation<CreateClinicMutation>(
    CREATE_CLINIC_DOCUMENT
  );
  const [createPatient] = useMutation<CreatePatientMutation>(
    CREATE_PATIENT_DOCUMENT
  );
  const [createAtom] = useMutation<CreateAtomPrescriptionMutation>(
    CREATE_ATOM_PRESCRIPTION_DOCUMENT
  );
  const [createPrescription] = useMutation<CreatePrescriptionMutation>(
    CREATE_ATOM_PRESCRIPTION_DOCUMENT
  );

  if (!clinic) return <p>Not Permission</p>;

  return (
    <div className="px-4 ">
      <h1 className="text-base font-extrabold">Create Dummy Data</h1>
      <p>
        병원 id: {clinic.id}
        <br />
        병원이름 : {clinic.name}
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
          type="button"
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
          type="button"
        >
          병원생성
        </button>
        <button
          onClick={() => {
            if (!clinic.id) throw new Error('clinicId false');
            arr
              .map((_, idx) => makePatient(`환자님${idx}`, clinic.id))
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
          type="button"
        >
          환자생성
        </button>
        <button onClick={() => {}} type="button">
          치료사 초대
        </button>
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
          type="button"
        >
          아톰 만들기
        </button>
        <button
          onClick={() => {
            newPrescriptions.forEach(
              ({ name, prescriptionAtomIds, price, requiredTime }) =>
                createPrescription({
                  variables: {
                    input: {
                      clinicId: clinic.id,
                      name,
                      prescriptionAtomIds,
                      price,
                      requiredTime,
                    },
                  },
                })
            );
          }}
          type="button"
        >
          처방 만들기
        </button>
      </div>
      <CreateReservation />
    </div>
  );
}
