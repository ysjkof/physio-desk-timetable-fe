import { Link } from 'react-router-dom';
import { isLoggedInVar } from '../../../../apollo';
import { ROUTES } from '../../../../router/routes';
import H1 from '../atoms/H1';
import Li from '../atoms/Li';
import P from '../atoms/P';
import Section from '../atoms/Section';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRotateLeft,
  faBan,
  faCommentSlash,
} from '@fortawesome/free-solid-svg-icons';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import DocsEventBox from '../molecules/DocsEventBox';
import { ReservationState } from '../../../../graphql/generated/graphql';

export default function LandingPage() {
  const isLoggedIn = isLoggedInVar();
  const [isMobile] = useMediaQuery({ minWidth: '640px' });

  const tableWide = '/images/landing-page/table-wide.webp';
  const myFourClinicsMobil = '/images/landing-page/my-four-clinics_mobil.webp';
  const myFourClinicsDesk = '/images/landing-page/my-four-clinics_desk.webp';

  const features = [
    '실시간 동기화',
    '예약 복사 붙여넣기',
    '쉬는 날 예약 막기',
    '직원 추가',
    '이직시 백업 안 필요',
    '처방 추가',
    '시간표 시간 조절',
    '팀원 색깔 구별',
    '통계',
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
        <div
          className="mx-auto flex h-[400px] max-w-7xl items-center justify-center bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${tableWide})`,
          }}
        >
          <H1 className="w-full bg-white/70 py-16 px-6 text-center text-4xl font-bold">
            무울시간표가 캘린더 기반 예약 시스템에 필요한 모든 걸 제공합니다.
          </H1>
        </div>
      </Section>
      <Section className="bg-stone-200 py-10">
        <P>
          더 이상 예약 관리를 위해 스프레드 시트를 만들지 마세요. 무울시간표는
          스프레드 시트 시간표의 장점만 가져왔습니다. 그리고 더{' '}
          <strong>간단하고</strong>, <strong>쉽고</strong>,{' '}
          <strong>빠릅니다</strong>.
        </P>
        {!isLoggedIn && (
          <p className="flex items-center justify-center">
            <Link
              to={ROUTES.sign_up}
              className="my-6 mr-2 rounded-md bg-black px-4 py-2 text-xl text-white"
            >
              회원가입
            </Link>
            하고 시작해보세요.
          </p>
        )}
        <ul className="mt-10 grid w-full grid-cols-[60%] flex-wrap justify-center gap-y-6 p-0 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-3">
          {features.map((text) => (
            <Li key={text}>{text}</Li>
          ))}
        </ul>
      </Section>
      <Section>
        <H1>여러개의 병원을 관리할 수 있습니다.</H1>
        <P>예전에 그만둔 병원도 소속됐던 기간의 예약을 확인할 수 있습니다.</P>
        <div className="flex justify-center">
          <img
            className="h-fit w-[608px]"
            src={isMobile ? myFourClinicsMobil : myFourClinicsDesk}
          />
        </div>
      </Section>
      <Section>
        <H1>빠른 예약 상태 변경</H1>
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
        <H1>구성원 또는 처방을 쉽고 간단하게 바꿀 수 있습니다.</H1>
        <P>
          스프레드 시트 처럼 열과 행을 추가하고 수식(함수)을 신경쓰면서 어렵게
          고칠필요 없습니다. 그냥 등록하면 통계에 연결된 복잡한 기능은 자동으로
          처리됩니다
        </P>
      </Section>
    </>
  );
}
