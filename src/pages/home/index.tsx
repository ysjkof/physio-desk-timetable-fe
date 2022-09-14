import { Link } from 'react-router-dom';
import { isLoggedInVar } from '../../apollo';
import { ROUTES } from '../../router/routes';
import H1 from './components/H1';
import Li from './components/Li';
import P from './components/P';
import Section from './components/Section';

export function Home() {
  const isLoggedIn = isLoggedInVar();
  return (
    <div className="h-full overflow-y-scroll text-base">
      <Section>
        <H1>
          무울시간표가 캘린더 기반 예약 시스템에 필요한 모든 걸 제공합니다.
        </H1>
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
        <ul className="mt-6 flex w-fit flex-wrap gap-x-12 gap-y-6">
          {[
            '실시간 동기화',
            '예약할 시간 확인 ',
            '예약 복사, 붙여넣기',
            '쉬는 날엔 예약 막기',
            '직원 추가',
            '이직시 백업 안 필요',
            '처방 추가',
            '시간표 시간 조절',
            '팀원 색깔 구별',
            '통계도 자동',
          ].map((text) => (
            <Li>{text}</Li>
          ))}
        </ul>
      </Section>
      <Section bgColor="white">
        <H1>
          여러개의 병원을 관리할 수 있고 이직해도 이전 예약을 확인할 수
          있습니다.
        </H1>
        <P>
          병원을 옮긴다고 백업할 필요 없습니다. 병원을 나와도 소속됐던 기간의
          예약은 언제든 확인할 수 있습니다.
        </P>
        <P>
          그리고 요일 별로 다른 병원으로 출근하거나,{' '}
          <strong>여러 병원을 관리</strong>
          한다면 무울시간표로 쉽게 관리할 수 있습니다.
        </P>
      </Section>
      <Section bgColor="white">
        <H1>구성원이나 처방의 변경을 쉽게 하세요.</H1>
        <P>직원, 처방 추가와 변경은 간단하게. 통계는 자동으로.</P>
        <P>
          스프레드 시트에서 열과 행을 추가하고 수식(함수)을 신경쓰면서 어렵게
          고칠필요 없습니다. 간단하게 추가할 수 있고 연결된 수식은 무울시간표가
          자동으로 해결합니다
        </P>
      </Section>
    </div>
  );
}
