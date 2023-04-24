import { type PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../../../components';

export default function AuthContainer({ children }: PropsWithChildren) {
  return (
    <div className="my-10 flex h-full grow flex-col items-center">
      <div className="flex h-full w-full max-w-screen-sm grow flex-col items-center px-5 overflow-hidden
      ">
        <Link className="mb-4" to="/">
          <Logo size="4xl" />
        </Link>
        {children}
        <Link
          to="/sign-up"
          className="mb-1 font-medium text-[#0052cc] hover:underline"
        >
          <span className="mr-2">계정이 없습니까?</span>
          회원가입
        </Link>
        <Link
          to="/login"
          className="font-medium text-[#0052cc] hover:underline"
        >
          <span className="mr-2">이미 계정이 있습니까?</span>
          로그인
        </Link>
      </div>
    </div>
  );
}
