import { Link } from 'react-router-dom';
import { Check, Guard, Insights, QuickRef } from '../../../../svgs';
import { SERVICE_NAME } from '../../../../constants/constants';

export default function LandingPage() {
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
    <article className="landing-page">
      <section className="items-center">
        <h2 className="lading-page__big-title">
          병원 예약을 <span className="text-[#5A84FF]">똑똑하게</span> 관리하는
          방법
        </h2>
        <p className="lading-page__description--small mb-8 md:w-[26rem]">
          <span>{SERVICE_NAME.ko}는 캘린더 기반</span>
          <span>예약 시스템에 필요한</span>
          <span>모든걸 제공하는</span>
          <span className="underline decoration-[#DCFFEA] decoration-8 underline-offset-0">
            병원전용 예약 관리 서비스
          </span>
          <span>입니다.</span>
        </p>

        <Link
          to="sign-up"
          className="landing-page__btn"
          style={{
            background:
              'linear-gradient(90deg, rgba(107,166,255,1) 0%, rgba(107,166,255,1) 10%, rgba(53,99,255,1) 100%)',
          }}
        >
          회원가입
        </Link>
      </section>

      <section className="relative mt-4">
        <div className="relative z-10 px-4">
          <img src="images/landing-page/timetable.png" className="" />
        </div>
        <div className="absolute bottom-0 z-0 block h-1/2 w-full bg-[#6BA6FF] md:h-[230px]" />
      </section>

      <section className="items-center">
        <h3 className="lading-page__small-title">서비스 소개</h3>
        <p className="lading-page__big-title--small mb-12 tracking-tighter sm:tracking-normal md:flex md:flex-col">
          <span className="mr-2">물리치료실과 접수팀의 협업을 위해</span>
          <span>
            <span className="text-[#6BA6FF]">서비스 목표</span>를 정했습니다.
          </span>
        </p>

        <div className="lading-page__card-container">
          <div className="lading-page__card">
            <QuickRef className="lading-page__card-icon" />
            <span>빠른</span>
            <span>일정파악</span>
          </div>
          <div className="lading-page__card">
            <Insights className="lading-page__card-icon" />
            <span>예약</span>
            <span>통계분석</span>
          </div>
          <div className="lading-page__card">
            <Guard className="lading-page__card-icon" />
            <span>예약</span>
            <span>실수방지</span>
          </div>
        </div>
      </section>

      <section className="mt-10 bg-[#282F3D] text-white">
        <div className="mb-16 flex flex-col items-center pt-12">
          <h3 className="lading-page__small-title">기능 소개</h3>
          <p className="lading-page__big-title flex flex-col">
            <span>{SERVICE_NAME.ko}은 아래와 같은</span>
            <span>필수 기능들 제공합니다.</span>
          </p>

          <ul className="landing-page__ul">
            {features.map((text, idx) => (
              <li key={idx} className="landing-page__li--half">
                {text && <Check className="landing-page__li-icon" />}
                {text}
              </li>
            ))}
          </ul>
        </div>

        <ul className="landing-page__ul flex-col">
          <li className="landing-page__li">
            <div className="landing-page__li-number">
              <span className="text-xl font-medium">1</span>
            </div>
            <p className="lading-page__big-title flex flex-col">
              여러 병원을 관리할 수 있습니다.
            </p>
            <p className="lading-page__description--small mb-8 md:w-96">
              <span className="mr-2">병원을 퇴사해도 근무했던 기간의</span>
              <span>예약을 확인할 수 있습니다.</span>
            </p>
            <div>
              <img src="images/landing-page/my-clinic.png" />
            </div>
          </li>

          <li className="landing-page__li">
            <div className="landing-page__li-number">
              <span className="text-xl font-medium">2</span>
            </div>
            <p className="lading-page__big-title flex flex-col">
              <span className="mr-2">빠르게 예약상태를</span>
              <span>변경할 수 있습니다.</span>
            </p>
            <p className="lading-page__description--small mb-8 md:w-96">
              <span>예약 상자를 클릭하면 자세히보기 창에서</span>
              <span>예약를 수정할 수 있습니다.</span>
            </p>
            <div>
              <img src="images/landing-page/reservation-detail.png" />
            </div>
          </li>

          <li className="landing-page__li relative">
            <div className="landing-page__li-number">
              <span className="text-xl font-medium">3</span>
            </div>
            <p className="lading-page__big-title flex flex-col">
              <span>구성원 또는 처방을</span>
              <span>쉽게 수정할 수 있습니다</span>
            </p>
            <p className="lading-page__description--small mb-8">
              <span>
                스프레드 시트처럼 열과 행을 추가하고 수식을 신경쓰면서 어렵게
                고칠 필요가 없습니다.
              </span>
              <span>
                그냥 등록하면 통계에 연결된 복잡한 기능은 자동으로 처리됩니다.
              </span>
            </p>

            <div className="relative z-10">
              <img src="images/landing-page/etc-function.png" />
            </div>
            <div className="relative h-24 w-full">
              <div className="position-center-x absolute bottom-0 z-0 h-44 w-screen bg-white md:h-72" />
            </div>
          </li>
        </ul>
      </section>
    </article>
  );
}
