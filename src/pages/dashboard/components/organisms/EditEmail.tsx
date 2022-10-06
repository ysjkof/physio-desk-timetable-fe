import { useForm } from 'react-hook-form';
import FormError from '../../../../components/atoms/FormError';
import Button from '../../../../components/molecules/Button';
import Input from '../../../../components/molecules/Input';
import { REG_EXP } from '../../../../constants/regex';
import { useSendChangeEmailMutation } from '../../../../graphql/generated/graphql';
import { useMe } from '../../../../hooks/useMe';
import { toastVar } from '../../../../store';

export default function EditEmail() {
  const { data: userData } = useMe();
  const {
    register,
    getValues,
    formState: { isValid, errors },
  } = useForm<{ email: string }>({
    mode: 'onChange',
    defaultValues: {
      email: userData?.me.email,
    },
  });

  const [sendChangeEmailMutation, { loading }] = useSendChangeEmailMutation();

  const sendChangeEmail = () => {
    let { email } = getValues();
    email = email.trim();
    if (email === userData?.me.email) return;

    sendChangeEmailMutation({
      variables: { input: { email } },
      onCompleted(data) {
        const { ok, error } = data.sendChangeEmail;
        if (ok) {
          return toastVar({
            messages: [
              '이메일 변경 인증 이메일을 보냈습니다.',
              '입력한 이메일에서 인증 메일을 확인하세요.',
            ],
          });
        }

        if (error) {
          return toastVar({
            messages: [error],
          });
        }
      },
    });
  };

  return (
    <div className="space-y-6 border-b pb-10">
      <Input
        id="edit-profile__email"
        label="새 이메일 주소"
        type="email"
        placeholder="Email"
        maxLength={REG_EXP.email.maxLength}
        register={register('email', {
          required: 'Email을 입력하세요',
          pattern: REG_EXP.email.pattern,
        })}
      >
        {errors.email?.message && (
          <FormError errorMessage={errors.email.message} />
        )}
        {errors.email?.type === 'pattern' && (
          <FormError errorMessage={REG_EXP.email.condition} />
        )}
      </Input>
      <p>
        전송하기를 누르면 입력한 새 이메일 주소에 인증 이메일이 전송됩니다.
        전송된 이메일의 링크를 클릭하면 새 이메일 주소로 바뀝니다.
      </p>
      <Button
        type="submit"
        isWidthFull
        canClick={isValid}
        loading={loading}
        onClick={sendChangeEmail}
      >
        변경 인증 이메일 전송하기
      </Button>
    </div>
  );
}
