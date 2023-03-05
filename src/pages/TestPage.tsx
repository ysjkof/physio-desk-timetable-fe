import { useMutation, useQuery } from '@apollo/client';
import { FormEvent, useState } from 'react';
import {
  CREATE_ATOM_PRESCRIPTION_DOCUMENT,
  CREATE_RESERVATION_DOCUMENT,
  GET_ALL_PATIENTS_BY_CLINIC_DOCUMENT,
  GET_PRESCRIPTIONS_BY_CLINIC_DOCUMENT,
} from '../graphql';
import { PrescriptionWithSelect } from '../types/commonTypes';
import type {
  CreateAtomPrescriptionMutation,
  CreateReservationMutation,
  GetAllPatientsByClinicQuery,
  GetAllPatientsByClinicQueryVariables,
  GetPrescriptionsByClinicQuery,
  GetPrescriptionsByClinicQueryVariables,
} from '../types/generatedTypes';
import { useGetClinic } from '../hooks';
import { useStore } from '../store';

export default function TestPage() {
  return (
    <div className="px-4 ">
      <h1 className="text-base font-extrabold">TEST PAGE</h1>
      {/* 이하 더미 자료 만드는 곳 */}
      <CreateDummyData />
    </div>
  );
}

function CreateDummyData() {
  const [clinic] = useGetClinic();

  const [reserveDate] = useState(new Date().getMonth() + 1);

  const [createAtom] = useMutation<CreateAtomPrescriptionMutation>(
    CREATE_ATOM_PRESCRIPTION_DOCUMENT
  );

  const invokeCreateAtom = () => {
    ['도수치료', '충격파'].forEach((name) =>
      createAtom({
        variables: {
          input: {
            name,
          },
        },
      })
    );
  };

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
        <button onClick={invokeCreateAtom} type="button">
          아톰 만들기
        </button>
      </div>
      <CreateReservation />
    </div>
  );
}

const length = 10;
const arr: unknown[] = [];
arr.length = length;
arr.fill(0);

function CreateReservation() {
  const [createdReservation, setCreatedReservation] = useState({
    tryCount: 0,
    okCount: 0,
    errors: {},
    patientIds: new Set(),
  });
  const clinicId = useStore((state) => state.pickedClinicId);
  const [myClinic] = useGetClinic();

  const { data: prescriptionsData } = useQuery<
    GetPrescriptionsByClinicQuery,
    GetPrescriptionsByClinicQueryVariables
  >(GET_PRESCRIPTIONS_BY_CLINIC_DOCUMENT, {
    variables: { input: { id: clinicId } },
  });
  const { data: allPatients } = useQuery<
    GetAllPatientsByClinicQuery,
    GetAllPatientsByClinicQueryVariables
  >(GET_ALL_PATIENTS_BY_CLINIC_DOCUMENT, {
    variables: { input: { id: clinicId } },
  });
  const [createReservationMutation] = useMutation<CreateReservationMutation>(
    CREATE_RESERVATION_DOCUMENT
  );

  if (!clinicId) return <p>로그인 해야 됩니다.</p>;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const date = form.get('date') as string;

    if (!clinicId || !date) return console.warn('날짜와 병원 id가 잘못됐다.');

    const [year, month, day] = date.split('-');

    const prescriptions: PrescriptionWithSelect[] =
      prescriptionsData?.getPrescriptionsByClinic.prescriptions?.map(
        (prescription) => ({
          ...prescription,
          isSelect: false,
        })
      ) || [];

    const firstDate = new Date(`${year}-${month}-${day}`);

    const lastDay = new Date(firstDate);
    lastDay.setMonth(lastDay.getMonth() + 1);
    lastDay.setDate(0);

    let tryCount = 0;
    let okCount = 0;
    let patientIds = new Set();
    const errors: { [key: string]: number } = {};

    for (let i = 0; i < lastDay.getDate(); i += 1) {
      firstDate.setDate(i + 1);
      const prescription = selectPrescriptionForTest(prescriptions);
      const times = getOneDayReservationInputDateForTest(
        firstDate,
        prescription
      );

      const patients = allPatients?.getAllPatientsByClinic.results;

      if (!patients) throw new Error('patients가 없습니다.');

      times.forEach((time) => {
        const patientRandom = Math.floor(
          Math.random() * (patients.length || 0)
        );
        patientIds.add(patientRandom);
        const memberRandom = Math.floor(
          Math.random() * (myClinic?.members.length || 0)
        );
        const patientId = patients[patientRandom].id;
        const userId = myClinic?.members[memberRandom].user.id;

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
          onCompleted({ createReservation: { ok, error } }) {
            tryCount += 1;
            if (ok) {
              okCount += 1;
            } else if (error) {
              errors[error] ? (errors[error] += 1) : (errors[error] = 1);
            }

            setCreatedReservation({
              tryCount,
              okCount,
              errors,
              patientIds,
            });
          },
        });
      });
    }
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
            type="text"
            placeholder="yyyy-mm-dd"
            defaultValue={'2023-03-01'}
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
        시도 환자 수 : {createdReservation.patientIds.size}
        <br />
        병원이름 : {myClinic?.name}
        <br />
        예약 시도 수 : {createdReservation.tryCount}
        <br />
        예약 성공 수 : {createdReservation.okCount}
        <br />
        에러 :
        {Object.entries(createdReservation.errors).map(([key, value]) => (
          <div key={key}>
            {key}: {value as number}
          </div>
        ))}
      </p>
    </div>
  );
}

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
    // console.log('날짜 >>>', th, tm, sd, ed);

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
