import { useMutation } from '@apollo/client';
import type {
  SendMessageMutation,
  SendMessageMutationVariables,
} from '../../../types/generatedTypes';
import { SEND_MESSAGE_DOCUMENT } from '../../../graphql';
import { setAlert } from '../../../store';

export const useSendMessageMutation = () => {
  const [_sendMessageMutation] = useMutation<
    SendMessageMutation,
    SendMessageMutationVariables
  >(SEND_MESSAGE_DOCUMENT);

  const sendMessageMutation = (content: string, to: string) => {
    _sendMessageMutation({
      variables: { input: { content, to } },
      onCompleted(data) {
        const { ok, error } = data.sendMessage;
        if (ok) return setAlert({ messages: ['문자메시지 전송 성공'] });
        if (error)
          return setAlert({ messages: ['문자메시지 전송 실패', error] });
      },
    });
  };

  return [sendMessageMutation];
};
