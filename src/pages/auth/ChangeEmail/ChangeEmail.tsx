import { useEffect, useState } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { client } from '../../../apollo';
import { MUOOL } from '../../../constants/constants';
import { loggedInUserVar } from '../../../store';
import {
  USER_EMAIL_AND_VERIFY_FIELDS,
  VERIFY_CHANGE_EMAIL_DOCUMENT,
} from '../../../graphql';
import type { VerifyChangeEmailMutation } from '../../../types/generated.types';

export default function ChangeEmail() {
  const loggedInUser = useReactiveVar(loggedInUserVar);
  const [message, setMessage] = useState('');

  const [verifyChangeEmailMutation, { loading }] =
    useMutation<VerifyChangeEmailMutation>(VERIFY_CHANGE_EMAIL_DOCUMENT);

  useEffect(() => {
    if (loading) return;
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const email = url.searchParams.get('new');
    const prevEmail = url.searchParams.get('prev');

    if (code && email) {
      verifyChangeEmailMutation({
        variables: {
          input: {
            email,
            code,
          },
        },
        onCompleted(data) {
          const { ok, error } = data.verifyChangeEmail;
          if (error) {
            return setMessage(error);
          }
          if (ok) {
            setMessage(
              `이메일 변경을 완료했습니다.
              ${prevEmail} -> ${email}`
            );
          }

          if (loggedInUser?.id) {
            // Reading and Writing Data to the cache guide: writeFragment
            // Fragment는 전체 DB에서 수정하고 싶은 일부분이다.
            client.writeFragment({
              // 캐시에서 User:1 이런식으로 돼 있기 때문에 아래처럼.
              id: `User:${loggedInUser.id}`,
              // 이하 cache로 보내서 업데이트 됐으면 하는 프래그먼트로. 무엇을 바꾸고 싶은지 선언
              fragment: USER_EMAIL_AND_VERIFY_FIELDS,
              // 그 data를 보냄.
              data: {
                email,
                verified: true,
              },
            });
          }
        },
      });
      return;
    }
  }, []);

  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <Helmet>
        <title>이메일 인증 | {MUOOL}</title>
      </Helmet>
      <h2 className="mb-4 text-lg font-medium">이메일 인증</h2>
      <h4 className="animate-pulse text-base font-medium text-red-600">
        {message ? message : '화면을 닫지 말고 기다려주세요. 확인 중입니다.'}
      </h4>
    </div>
  );
}
