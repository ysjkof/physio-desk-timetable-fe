import { type PropsWithChildren } from 'react';
import { Textarea } from '../../../../../components';

interface FormForSendMessageProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  changeInputMessage: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  defaultMessage: string;
  bytes: number;
  preview: string;
}

export const FormForSendMessage = ({
  handleSubmit,
  changeInputMessage,
  defaultMessage,
  bytes,
  preview,
}: FormForSendMessageProps) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center rounded-md border bg-white px-8 py-4"
    >
      <div className="flex w-full justify-between gap-x-4">
        <MessageInput
          changeInputMessage={changeInputMessage}
          defaultMessage={defaultMessage}
        />
        <Preview bytes={bytes} preview={preview} />
      </div>
      <button
        className="css_default-button mt-6 w-36 border bg-[#6BA6FF] text-white"
        type="submit"
      >
        보내기
      </button>
    </form>
  );
};

interface MessageInputProps {
  changeInputMessage: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  defaultMessage: string;
}

const MessageInput = ({
  changeInputMessage,
  defaultMessage,
}: MessageInputProps) => {
  return (
    <InputWrapper>
      <h3 className="text-center">메시지</h3>
      <Textarea
        name="message"
        onChange={changeInputMessage}
        rows={14}
        defaultValue={defaultMessage}
      />
    </InputWrapper>
  );
};

interface PreviewProps {
  bytes: number;
  preview: string;
}

const Preview = ({ bytes, preview }: PreviewProps) => {
  return (
    <InputWrapper>
      <div className="relative flex w-full items-baseline">
        <div className="w-1/3" />
        <h3 className="w-1/3 text-center">미리보기</h3>
        <span className="w-1/3 text-sm">bytes: {bytes}/2000</span>
      </div>
      <Textarea name="preview" value={preview} disabled rows={14} />
    </InputWrapper>
  );
};

const InputWrapper = ({ children }: PropsWithChildren) => {
  return <div className="w-full max-w-sm">{children}</div>;
};
