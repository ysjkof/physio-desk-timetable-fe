import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { SERVICE_NAME } from '../../../constants/constants';
import { VERIFY_EMAIL_DOCUMENT } from '../../../graphql';
import { setAlert } from '../../../store';
import type { VerifyEmailMutation } from '../../../types/generatedTypes';

export default function ConfirmEmail() {
  const navigate = useNavigate();

  const [message, setMessage] = useState(
    '화면을 닫지 말고 기다려주세요. 확인 중입니다.'
  );

  const [errMsg, setErrMsg] = useState('');

  const [verifyEmail] = useMutation<VerifyEmailMutation>(VERIFY_EMAIL_DOCUMENT);

  const intervalUpdateMessage = () => {
    let i = 5;
    const WILL_GO_HOME_AFTER_SECOND = '초 뒤 첫 화면으로 갑니다';

    setMessage(`${i}${WILL_GO_HOME_AFTER_SECOND}`);

    const errorMessage = () => {
      i -= 1;
      setMessage(`${i}${WILL_GO_HOME_AFTER_SECOND}`);
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

          if (error) return setErrMsg(error);

          if (!ok) {
            throw new Error('Calling ConfirmEmail(). response ok is falsy.');
          }

          setAlert({
            messages: ['이메일 인증됐습니다'],
            isPositive: true,
          });

          navigate('/');
        },
      });
    }

    intervalUpdateMessage();

    const timeoutId = setTimeout(navigate, 5000, '/');
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Helmet>
        <title>이메일 인증 | {SERVICE_NAME.ko}</title>
      </Helmet>
      <h2 className="mb-4 text-lg font-medium">이메일 인증</h2>
      <p className="animate-pulse text-base font-medium text-red-600">
        {errMsg}
        <br />
        {message}
      </p>
    </div>
  );
}
