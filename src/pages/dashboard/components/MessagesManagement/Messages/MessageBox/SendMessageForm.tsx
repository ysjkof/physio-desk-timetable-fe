import { useRef, useEffect, useContext } from 'react';
import { useSendMessageForm } from './useSendMessageForm';
import { type PatientAtMessage } from '..';
import { MessagesContext } from '../MessagesContext';

// interface FormForSendMessageProps {
//   patient: PatientAtMessage | undefined;
//   isNewMessage: boolean;
// }

export const FormForSendMessage = () => {
  const { patient, isNewMessage } = useContext(MessagesContext);
  const {
    preview,
    bytes,
    inputHeight,
    setInputHeight,
    changeInputMessage,
    handleSubmit,
  } = useSendMessageForm(patient);

  console.log('FormForSendMessage', patient, isNewMessage);
  if (!patient) return null;
  return (
    <form
      onSubmit={handleSubmit}
      className="relative mx-auto mb-6 mt-2 flex w-full max-w-sm items-center gap-x-2 px-2 py-2"
    >
      <Preview bytes={bytes} preview={preview} inputHeight={inputHeight} />
      <MessageInput
        changeInputMessage={changeInputMessage}
        setInputHeight={setInputHeight}
      />
      <button
        className="rounded-2xl bg-cst-blue p-1 px-2 text-white shadow"
        type="submit"
      >
        보내기
      </button>
    </form>
  );
};

interface MessageInputProps {
  changeInputMessage: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setInputHeight: (height: number | undefined) => void;
}

const MessageInput = ({
  changeInputMessage,
  setInputHeight,
}: MessageInputProps) => {
  const adjustTextareaHeight = () => {
    if (!ref.current) return;
    ref.current.style.height = 'auto';
    ref.current.style.height = `${ref.current.scrollHeight}px`;
    setInputHeight(ref.current.scrollHeight);
  };
  const ref = useRef<HTMLTextAreaElement>(null);

  return (
    <textarea
      name="message"
      rows={1}
      className="w-full rounded-3xl px-3 py-2 shadow"
      placeholder="<환자>나 <병원>을 입력해보세요"
      ref={ref}
      onChange={changeInputMessage}
      onInput={adjustTextareaHeight}
    />
  );
};

interface PreviewProps {
  bytes: number;
  preview: string;
  inputHeight: number | undefined;
}

const Preview = ({ bytes, preview, inputHeight }: PreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const adjustTextareaHeight = () => {
    if (!containerRef.current || !textAreaRef.current || !inputHeight) return;
    textAreaRef.current.style.height = 'auto';
    textAreaRef.current.style.height = `${inputHeight + 40}px`;
    containerRef.current.style.bottom = `${inputHeight + 16}px`;
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [preview, inputHeight]);

  if (!preview) return null;

  return (
    <div
      className="absolute left-0 z-10 w-full overflow-y-scroll whitespace-pre-wrap break-words rounded-md rounded-xl border bg-white shadow"
      ref={containerRef}
    >
      <PreviewHeader bytes={bytes} />
      <textarea
        className="w-full border-none bg-white px-4 pt-2 text-gray-600/90"
        name="preview"
        value={preview}
        disabled
        ref={textAreaRef}
      />
    </div>
  );
};

const PreviewHeader = ({ bytes }: { bytes: number }) => {
  return (
    <div className="relative mx-3 mt-1.5 flex items-baseline justify-end border-b pb-0.5">
      <h3 className="w-1/3 text-center text-sm font-bold">미리보기</h3>
      <div className="flex w-1/3 justify-end">
        <span className="text-xs text-gray-500">
          bytes: {bytes} / <span className="text-gray-800">2000</span>
        </span>
      </div>
    </div>
  );
};
