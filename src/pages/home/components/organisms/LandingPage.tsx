import { Link } from 'react-router-dom';
import { isLoggedInVar } from '../../../../apollo';
import { ROUTES } from '../../../../router/routes';
import H2 from '../atoms/H2';
import Li from '../atoms/Li';
import P from '../atoms/P';
import Section from '../atoms/Section';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRotateLeft,
  faBan,
  faCommentSlash,
} from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from '../../../../hooks';
import DocsEventBox from '../molecules/DocsEventBox';
import Check from '../../../../svgs/Check';
import H1 from '../atoms/H1';
import H3 from '../atoms/H3';
import { ReservationState } from '../../../../types/generated.types';

export default function LandingPage() {
  const isLoggedIn = isLoggedInVar();
  const [isMobile] = useMediaQuery({ minWidth: '640' });

  const tableWide = '/images/landing-page/table-wide.webp';
  const myFourClinicsMobil = '/images/landing-page/my-four-clinics_mobil.webp';
  const myFourClinicsDesk = '/images/landing-page/my-four-clinics_desk.webp';
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
  ];

  const threeReservationState = [
    ReservationState.Reserved,
    ReservationState.Canceled,
    ReservationState.NoShow,
  ];

  const descriptionReservationState = [
    {
      title: '예약',
      description: (
        <p className="m-0">
          예약 상태입니다. 상자 배경색은 회색이 아닌 특정 색깔로 표시됩니다
        </p>
      ),
    },
    {
      title: '취소',
      description: (
        <p className="m-0">
          두 번째 아이콘{' '}
          <FontAwesomeIcon
            icon={faBan}
            fontSize={24}
            className="text-red-500"
          />
          을 누르면 취소 상태가 됩니다.
        </p>
      ),
    },
    {
      title: '부도',
      description: (
        <p className="m-0">
          세 번째 아이콘{' '}
          <FontAwesomeIcon
            icon={faCommentSlash}
            fontSize={24}
            className="text-black"
          />
          을 누르면 부도 상태가 됩니다.
        </p>
      ),
    },
    {
      title: '되돌리기',
      description: (
        <p className="m-0">
          취소나 부도 상태일 때 네 번째 아이콘{' '}
          <FontAwesomeIcon
            icon={faArrowRotateLeft}
            fontSize={24}
            className="text-blue-800"
          />
          누르면 예약 상태로 돌아갑니다.
        </p>
      ),
    },
  ];

  return (
    <>
      <Section widthFull>
        <div className="mx-auto flex max-w-7xl flex-col">
          <img
            src={tableWide}
            className="h-[101px] w-full md:h-[189px] lg:h-[303px]"
          />
        </div>
      </Section>
      <Section>
        <H1 className="">병원 예약을 간편하게 관리하는 방법</H1>
        <P className="mx-auto mb-0 w-72 sm:w-96">
          무울시간표는 캘린더 기반 예약 시스템에 필요한 모든 걸 제공하는{' '}
          <strong>병원 전용 예약 관리 서비스</strong>입니다.
        </P>
        {!isLoggedIn && (
          <P className="mx-auto mt-8 w-72 sm:w-96">
            <Link
              to={ROUTES.sign_up}
              className="my-6 mr-2 rounded-md bg-black px-8 py-0.5 font-medium text-white"
            >
              회원가입
            </Link>
            하고 시작해보세요.
          </P>
        )}
      </Section>
      <Section className="">
        <H2>물리치료실과 접수팀이 협업하기 위한 병원 전용 예약 관리 서비스</H2>
        <div className="mx-auto flex w-fit pr-10">
          <span>우리 목표는</span>
          <ul className="mx-3">
            <li className="italic underline">빠른 일정 파악</li>
            <li className="italic underline">예약 통계 분석</li>
            <li className="italic underline">예약 실수 방지</li>
          </ul>
          <span className="self-end">입니다.</span>
        </div>
      </Section>
      <Section>
        <H2>필수 기능을 제공합니다</H2>
        <ul className="grid gap-y-4 pt-10 sm:grid-cols-2 sm:gap-y-6 md:grid-cols-3 md:gap-x-12">
          {features.map((text) => (
            <Li key={text}>
              <Check className="mr-2" />
              {text}
            </Li>
          ))}
        </ul>
      </Section>
      <div className="mb-20 w-full border-b" />
      <Section>
        <H2>기능소개</H2>

        <Section>
          <H3>여러개의 병원을 관리할 수 있습니다.</H3>
          <P>예전에 그만둔 병원도 소속됐던 기간의 예약을 확인할 수 있습니다.</P>
          <div className="flex justify-center">
            <img
              className="h-fit sm:w-[279px] md:w-[544px] "
              src={isMobile ? myFourClinicsMobil : myFourClinicsDesk}
            />
          </div>
        </Section>
        <Section>
          <H3>빠른 예약 상태 변경</H3>
          <P>
            예약 상자에 마우스를 올리면 빠른 예약 상태 변경 아이콘이 나타납니다.
          </P>
          <div className="mt-12 flex">
            <div className="flex w-1/2 flex-col gap-5 pr-4">
              {threeReservationState.map((state) => (
                <div
                  key={state}
                  className="relative flex h-1/4 justify-center pt-2"
                >
                  <DocsEventBox height={70} width={150} state={state} />
                </div>
              ))}
              <div className="h-1/4"></div>
            </div>
            <div className="flex w-1/2 flex-col gap-5">
              {descriptionReservationState.map((state) => (
                <div key={state.title} className="relative flex h-1/4 flex-col">
                  <h3 className="mb-4 mt-0 text-xl font-medium text-gray-900">
                    {state.title}
                  </h3>
                  {state.description}
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section>
          <H3>구성원 또는 처방을 쉽고 간단하게 바꿀 수 있습니다.</H3>
          <P>
            스프레드 시트 처럼 열과 행을 추가하고 수식(함수)을 신경쓰면서 어렵게
            고칠필요 없습니다. 그냥 등록하면 통계에 연결된 복잡한 기능은
            자동으로 처리됩니다
          </P>
        </Section>
      </Section>
    </>
  );
}
