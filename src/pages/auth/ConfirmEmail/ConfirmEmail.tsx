import {
  gql,
  useApolloClient,
  useMutation,
  useReactiveVar,
} from '@apollo/client';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { MUOOL } from '../../../constants/constants';
import { loggedInUserVar } from '../../../store';
import { VERIFY_EMAIL_DOCUMENT } from '../../../graphql';
import type { VerifyEmailMutation } from '../../../types/generated.types';

export default function ConfirmEmail() {
  const client = useApolloClient();
  const navigate = useNavigate();
  const loggedInUser = useReactiveVar(loggedInUserVar);
  const [message, setMessage] = useState(
    '화면을 닫지 말고 기다려주세요. 확인 중입니다.'
  );

  if (loggedInUser?.verified) {
    navigate('/');
  }

  const [verifyEmail] = useMutation<VerifyEmailMutation>(VERIFY_EMAIL_DOCUMENT);

  const intervalUpdateMessage = (error: string | null | undefined) => {
    let i = 5;
    setMessage(`${error} ${i}초 뒤에 홈으로 이동합니다.`);
    const errorMessage = () => {
      i -= 1;
      setMessage(`${error} ${i}초 뒤에 홈으로 이동합니다.`);
      if (i < 1) {
        clearInterval(interval);
      }
    };
    const interval = setInterval(errorMessage, 1000);
  };

  useEffect(() => {
    const code = window.location.href.split('code=')[1];

    if (code) {
      verifyEmail({
        variables: {
          input: {
            code,
          },
        },
        onCompleted(data) {
          const {
            verifyEmail: { error },
          } = data;

          if (error) {
            return setMessage(error);
          }

          if (loggedInUser?.id) {
            // Reading and Writing Data to the cache guide: writeFragment
            // Fragment는 전체 DB에서 수정하고 싶은 일부분이다.
            client.writeFragment({
              // 캐시에서 User:1 이런식으로 돼 있기 때문에 아래처럼.
              id: `User:${loggedInUser.id}`,
              // 이하 cache로 보내서 업데이트 됐으면 하는 프래그먼트로. 무엇을 바꾸고 싶은지 선언
              fragment: gql`
                fragment VerifiedField on User {
                  verified
                }
              `,
              // 그 data를 보냄.
              data: {
                verified: true,
              },
            });
          }
          const successMessage = '이메일 인증됐습니다.';

          if (confirm(`${successMessage}확인을 누르면 시간표로 이동합니다.`)) {
            navigate('/');
          }
        },
      });
      return;
    }

    intervalUpdateMessage('코드가 없습니다. 잘못된 접근입니다.');
    const timeoutId = setTimeout(navigate, 5000, '/');
    return () => clearTimeout(timeoutId);
  }, [loggedInUser?.id]);

  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <Helmet>
        <title>이메일 인증 | {MUOOL}</title>
      </Helmet>
      <h2 className="mb-4 text-lg font-medium">이메일 인증</h2>
      <h4 className="animate-pulse text-base font-medium text-red-600">
        {message}
      </h4>
    </div>
  );
}
