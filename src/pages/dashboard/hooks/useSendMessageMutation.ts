import { useMutation } from '@apollo/client';
import { SEND_MESSAGE_DOCUMENT } from '../../../graphql';
import { setAlert, useStore } from '../../../store';
import {
  SendMessageInput,
  SendMessageMutation,
  SendMessageMutationVariables,
} from '../../../types/generatedTypes';

interface SendMessageMutationInput
  extends Pick<SendMessageInput, 'content' | 'patientId'> {}

export const useSendMessageMutation = () => {
  const [_sendMessageMutation] = useMutation<
    SendMessageMutation,
    SendMessageMutationVariables
  >(SEND_MESSAGE_DOCUMENT);

  const clinicId = useStore((state) => state.pickedClinicId);

  const sendMessageMutation = ({
    content,
    patientId,
  }: SendMessageMutationInput) => {
    _sendMessageMutation({
      variables: { input: { content, clinicId, patientId } },
      onCompleted(data) {
        const { ok, error } = data.sendMessage;
        if (ok)
          return setAlert({
            messages: ['문자메시지 전송 성공'],
            isPositive: true,
          });
        if (error)
          return setAlert({ messages: ['문자메시지 전송 실패', error] });
      },
    });
  };

  return [sendMessageMutation];
};
