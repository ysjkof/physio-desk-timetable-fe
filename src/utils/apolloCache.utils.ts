import { gql } from '@apollo/client';
import { client } from '../apollo';
import { ClinicsOfClient } from '../models';

export const cacheUpdateUserName = (id: number, name: string) => {
  client.writeFragment({
    id: `User:${id}`,
    fragment: gql`
      fragment NameFields on User {
        name
      }
    `,
    data: { name },
  });
};

export const cacheUpdatePersonalClinicName = (name: string) => {
  const { id: clinicId, name: clinicName } =
    ClinicsOfClient.getPersonalClinic();

  client.writeFragment({
    id: `Clinic:${clinicId}`,
    fragment: gql`
      fragment ClinicName on Clinic {
        name
      }
    `,
    data: { name: `${name}:${clinicName.split(':').at(-1)}` },
  });
};
