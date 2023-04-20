import { Helmet } from 'react-helmet-async';
import { LandingPage } from './components';
import { MUOOL } from '../../constants/constants';

export default function Home() {
  return (
    <>
      <Helmet title={MUOOL} />
      <LandingPage />
    </>
  );
}
