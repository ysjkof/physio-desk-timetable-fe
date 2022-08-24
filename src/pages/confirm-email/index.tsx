import { gql, useApolloClient, useReactiveVar } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  useVerifyEmailMutation,
  VerifyEmailMutation,
} from '../../graphql/generated/graphql';
import { loggedInUserVar } from '../../store';

export const ConfirmEmail = () => {
  const client = useApolloClient();
  const navigate = useNavigate();
  const loggedInUser = useReactiveVar(loggedInUserVar);
  const [message, setMessage] = useState('');

  if (loggedInUser?.verified) {
    navigate('/');
  }

  const intervalUpdateMessage = (error: string | null | undefined) => {
    let i = 5;
    setMessage(`${error} ${i}초 뒤에 홈으로 이동합니다.`);
    const errorMessage = () => {
      i--;
      setMessage(`${error} ${i}초 뒤에 홈으로 이동합니다.`);
      if (i < 1) {
        clearInterval(interval);
      }
    };
    const interval = setInterval(errorMessage, 1000);
  };

  const onCompleted = (data: VerifyEmailMutation) => {
    const {
      verifyEmail: { ok, error },
    } = data;

    if (error) {
      setMessage(error);
    }
    if (ok && loggedInUser?.id) {
      // Reading and Writing Data to the cache guide: writeFragment
      // Fragment는 전체 DB에서 수정하고 싶은 일부분이다.
      client.writeFragment({
        // 캐시에서 User:1 이런식으로 돼 있기 때문에 아래처럼.
        id: `User:${loggedInUser.id}`,
        // 이하 cache로 보내서 업데이트 됐으면 하는 프래그먼트로. 무엇을 바꾸고 싶은지 선언
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        // 그 data를 보냄.
        data: {
          verified: true,
        },
      });
      navigate('/');
    }
  };

  const [verifyEmail] = useVerifyEmailMutation({ onCompleted });

  useEffect(() => {
    const [_, code] = window.location.href.split('code=');

    if (code) {
      verifyEmail({
        variables: {
          input: {
            code,
          },
        },
      });
      return;
    }

    intervalUpdateMessage('코드가 없습니다. 잘못된 접근입니다.');
    const timeoutId = setTimeout(navigate, 5000, '/');
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <Helmet>
        <title>Verify Email | Muool</title>
      </Helmet>
      <h2 className="mb-1  font-medium">Confirming email...</h2>
      <h4 className="text-red-600">
        {message ? message : "Please wait, don't close this page..."}
      </h4>
    </div>
  );
};
