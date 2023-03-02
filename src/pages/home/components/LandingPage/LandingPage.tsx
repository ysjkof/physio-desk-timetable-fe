import { Link } from 'react-router-dom';
import { useMediaQuery } from '../../../../hooks';
import { Check, Guard, Insights, QuickRef } from '../../../../svgs';

export default function LandingPage() {
  const [isMobile] = useMediaQuery({ minWidth: '640' });

  const features = [
    '한 눈에 일정 파악',
    '팀원 색깔 구별',
    '실시간 동기화',
    '시간표 시간 조절',
    '통계 자동화',
    '예약 복사 붙여넣기',
    '처방 만들기',
    '직원 초대하기',
    '쉬는 날 예약 막기',
    '이직시 백업 안 필요',
    '예약 수정한 사람 확인',
    undefined, // flex 칸 맞추기 위해서 배열 길이를 3의 배수로 한다
  ];

  return (
    <article className="mx-auto mt-14 flex flex-col items-center justify-center">
      <section className="flex flex-col items-center">
        <h1 className="text-center text-4xl font-bold">
          병원 예약을 <span className="text-[#5A84FF]">똑똑하게</span> 관리하는
          방법
        </h1>
        <p className="mt-8 flex flex-col gap-2 text-center text-2xl">
          <span className="block">
            무울시간표는 캘린더 기반 예약 시스템에 필요한
          </span>
          <span className="block">
            모든걸 제공하는{' '}
            <span className="underline decoration-[#DCFFEA] decoration-8 underline-offset-0">
              병원전용 예약 관리 서비스
            </span>
            입니다.
          </span>
        </p>

        <Link
          to="sign-up"
          className="mt-14 flex h-14 w-44 items-center justify-center rounded-full border text-2xl font-medium text-white"
          style={{
            background:
              'linear-gradient(90deg, rgba(107,166,255,1) 0%, rgba(107,166,255,1) 10%, rgba(53,99,255,1) 100%)',
          }}
        >
          회원가입
        </Link>
      </section>

      <section className="relative mt-20 w-full">
        <div className="relative z-10 h-[570px] bg-[url(images/landing-page/timetable.png)] bg-top bg-no-repeat" />
        <div className="absolute bottom-0 z-0 block h-[230px] w-full bg-[#6BA6FF]" />
      </section>

      <section className="flex flex-col items-center py-28">
        <h2 className="text-lg font-medium text-[#5B8DD8]">서비스 소개</h2>
        <p className="mt-4 flex flex-col items-center text-4xl font-bold">
          <span>물리치료실과 접수팀이 협업하기 위한</span>
          <span>
            <span className="text-[#6BA6FF]">서비스 목표</span>를 정했습니다.
          </span>
        </p>

        <div className="mt-12 flex gap-10">
          <div className="flex aspect-square w-[200px] flex-col items-center justify-center rounded-3xl bg-[#6BA6FF] text-2xl font-bold text-white">
            <QuickRef className="mb-2 h-2/5 w-2/5" />
            <span>빠른</span>
            <span>일정파악</span>
          </div>
          <div className="flex aspect-square w-[200px] flex-col items-center justify-center rounded-3xl bg-[#6BA6FF] text-2xl font-bold text-white">
            <Insights className="mb-2 h-2/5 w-2/5" />
            <span>예약</span>
            <span>통계분석</span>
          </div>
          <div className="flex aspect-square w-[200px] flex-col items-center justify-center rounded-3xl bg-[#6BA6FF] text-2xl font-bold text-white">
            <Guard className="mb-2 h-2/5 w-2/5" />
            <span>에약</span>
            <span>실수방지</span>
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col bg-[#282F3D] text-white">
        <div className="my-52 flex flex-col items-center">
          <h2 className="text-lg font-medium text-[#6FA8FF]">기능 소개</h2>
          <p className="mt-4 flex flex-col items-center gap-y-4 text-4xl font-bold">
            <span>Muool은 아래와 같은</span>
            <span>필수 기능들 제공합니다.</span>
          </p>

          <ul className="mt-14 flex max-w-4xl flex-wrap justify-between gap-y-10">
            {features.map((text, idx) => (
              <li
                key={idx}
                className="flex w-[17rem] items-center whitespace-nowrap text-2xl font-bold"
              >
                {text && <Check className="mr-2 h-10 w-10" />}
                {text}
              </li>
            ))}
          </ul>
        </div>

        <ul className="flex flex-col gap-48">
          <li className="flex flex-col items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6FA8FF]">
              <span className="text-xl font-medium text-[#282F3D]">1</span>
            </div>
            <p className="mt-4 flex flex-col items-center gap-y-4 text-4xl font-bold">
              <span>여러개의 병원을</span>
              <span>관리할 수 있습니다.</span>
            </p>
            <p className="mt-10 flex flex-col items-center gap-y-2 text-2xl">
              <span>예전에 그만둔 병원도 소속됐던 기간의</span>
              <span>예약을 확인할 수 있습니다.</span>
            </p>

            <div className="relative z-10 h-[650px] w-full bg-[url(images/landing-page/my-clinic.png)] bg-top bg-no-repeat" />
          </li>

          <li className="flex flex-col items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6FA8FF]">
              <span className="text-xl font-medium text-[#282F3D]">2</span>
            </div>
            <p className="mt-4 flex flex-col items-center gap-y-4 text-4xl font-bold">
              <span>빠르게 예약상태를</span>
              <span>변경할 수 있습니다.</span>
            </p>
            <p className="mt-10 flex flex-col items-center gap-y-2 text-2xl">
              <span>예약 상자를 클릭하면 자세히보기 창에서</span>
              <span>예약를 바꿀 수 있습니다.</span>
            </p>

            <div className="mt-14 h-[1000px] w-full bg-[url(images/landing-page/reservation-detail.png)] bg-top bg-no-repeat" />
          </li>

          <li className="flex flex-col items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6FA8FF]">
              <span className="text-xl font-medium text-[#282F3D]">3</span>
            </div>
            <p className="mt-4 flex flex-col items-center gap-y-4 text-4xl font-bold">
              <span>구성원 또는 처방을</span>
              <span>쉽고 간단하게 바꿀 수 있습니다</span>
            </p>
            <p className="mt-10 flex flex-col items-center gap-y-2 text-2xl">
              <span>
                스프레드 시트처럼 열과 행을 추가하고 수식을 신경쓰면서 어렵게
                고칠 필요가 없습니다.
              </span>
              <span>
                그냥 등록하면 통계에 연결된 복잡한 기능은 자동으로 처리됩니다.
              </span>
            </p>
          </li>
        </ul>
        <div className="relative w-full">
          <div className="relative z-10 mt-14 h-[1000px] bg-[url(images/landing-page/etc-function.png)] bg-top bg-no-repeat" />
        </div>
      </section>
      <div className="relative h-[12rem] w-full bg-transparent">
        <div className="absolute -top-64 z-0 h-[28rem] w-full bg-white" />
      </div>
    </article>
  );
}
