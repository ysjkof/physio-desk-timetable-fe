import { Link } from 'react-router-dom';
import { type PropsWithChildren } from 'react';
import LogoOfText from '../../../components/LogoOfText';

export default function AuthContainer({ children }: PropsWithChildren) {
  return (
    <div className="mt-10 flex h-screen flex-col items-center lg:mt-28">
      <div className="flex w-full max-w-screen-sm flex-col items-center px-5">
        <Link className="mb-4" to="/">
          <LogoOfText size={2} className="mb-6" />
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
