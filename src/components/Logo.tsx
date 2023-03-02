import { HTMLAttributes } from 'react';

interface LogoProps extends HTMLAttributes<HTMLHeadElement> {}

const LOGO_URL = '/images/logo.png';

export default function Logo({ ...args }: LogoProps) {
  return <img src={LOGO_URL} alt="muool-logo" {...args} />;
}
