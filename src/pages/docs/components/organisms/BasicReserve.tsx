import { ROUTES } from '../../../../router/routes';
import Md from './BasicReserve.mdx';

export default function BasicReserve() {
  return (
    <Md
      createPatientUrl={ROUTES.create_patient}
      createPrescriptionUrl={ROUTES.prescription}
    />
  );
}
