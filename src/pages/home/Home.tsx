import { Helmet } from 'react-helmet-async';
import { LandingPage } from './components';
import { SERVICE_NAME } from '../../constants/constants';

export default function Home() {
  return (
    <>
      <Helmet title={SERVICE_NAME.ko} />
      <LandingPage />
    </>
  );
}
