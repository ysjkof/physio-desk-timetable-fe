import { useMutation } from '@apollo/client';
import { SEND_CHANGE_EMAIL_DOCUMENT } from '../../../graphql';
import { setToast } from '../../../store';
import type {
  SendChangeEmailMutation,
  SendChangeEmailMutationVariables,
} from '../../../types/generatedTypes';

export const useSendChangeEmail = () => {
  const [sendChangeEmailMutation] = useMutation<
    SendChangeEmailMutation,
    SendChangeEmailMutationVariables
  >(SEND_CHANGE_EMAIL_DOCUMENT);

  const sendEmailToChangeEmail = (email: string) => {
    sendChangeEmailMutation({
      variables: { input: { email } },
      onCompleted(data) {
        const { ok, error } = data.sendChangeEmail;

        if (ok) {
          return setToast({
            messages: [
              `"${email}"로 인증 이메일을 보냈습니다.`,
              '받은 메일을 확인하세요.',
              '5분이 지나도 이메일이 도착하지 않으면 다시 요청해주세요.',
            ],
          });
        }

        if (error) {
          return setToast({
            messages: [error],
          });
        }
      },
    });
  };

  return sendEmailToChangeEmail;
};
