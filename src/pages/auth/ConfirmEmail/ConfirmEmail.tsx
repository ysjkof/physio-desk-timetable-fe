import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { MUOOL } from '../../../constants/constants';
import { VERIFY_EMAIL_DOCUMENT } from '../../../graphql';
import { useMe } from '../../../hooks';
import { setAlert } from '../../../store';
import { cacheUpdateUserVerified } from '../../../utils/apolloUtils';
import type { VerifyEmailMutation } from '../../../types/generatedTypes';

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const [meData] = useMe();

  const [message, setMessage] = useState(
    '화면을 닫지 말고 기다려주세요. 확인 중입니다.'
  );

  if (meData?.verified) {
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
            verifyEmail: { error, ok },
          } = data;

          if (error) {
            return setMessage(error);
          }

          if (!ok)
            throw new Error('Calling ConfirmEmail(). response ok is falsy.');

          if (meData) {
            cacheUpdateUserVerified(meData.id);
          }

          setAlert({
            messages: ['이메일 인증됐습니다'],
            isPositive: true,
          });
          navigate('/');
        },
      });
    }

    intervalUpdateMessage('코드가 없습니다. 잘못된 접근입니다.');
    const timeoutId = setTimeout(navigate, 5000, '/');
    return () => clearTimeout(timeoutId);
  }, [meData]);

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
