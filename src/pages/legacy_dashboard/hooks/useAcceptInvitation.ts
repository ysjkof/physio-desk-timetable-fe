import { useMutation, useReactiveVar } from '@apollo/client';
import { client } from '../../../apollo';
import { changeValueInArray } from '../../../utils/common.utils';
import { clinicListsVar, loggedInUserVar, toastVar } from '../../../store';
import { ClinicsOfClient } from '../../../models';
import {
  ACCEPT_INVITATION_DOCUMENT,
  FIND_MY_CLINICS_DOCUMENT,
  ME_DOCUMENT,
} from '../../../graphql';
import {
  AcceptInvitationMutation,
  ClinicType,
  FindMyClinicsQuery,
  MeQuery,
} from '../../../types/generated.types';

export default function useAcceptInvitation() {
  const [acceptInvitationMutation, { loading }] =
    useMutation<AcceptInvitationMutation>(ACCEPT_INVITATION_DOCUMENT);

  const clinicLists = useReactiveVar(clinicListsVar);
  const { selectedClinic } = ClinicsOfClient;

  const loggedInUserId = loggedInUserVar()?.id;
  const clinicName = selectedClinic.name;
  const selectedClinicId = selectedClinic.id;
  const memberId = selectedClinic.members.find(
    (member) => member.user.id === loggedInUserId
  )?.id;

  if (!memberId) throw new Error('memberId가 없습니다');

  const acceptInvitation = (clinicId: number) => {
    if (!loading && confirm('초대를 수락합니다')) {
      const acceptedClinic = clinicLists.find(
        (clinic) => clinic.id === clinicId
      );
      if (!acceptedClinic)
        throw new Error('병원 목록과 병원 ID가 일치하지 않습니다');

      acceptInvitationMutation({
        variables: {
          input: {
            clinicId,
          },
        },
        onCompleted(data) {
          if (data.acceptInvitation.ok) {
            toastVar({ messages: ['병원 초대를 수락했습니다'] });
            const memberIdx = acceptedClinic.members.findIndex(
              (member) => member.user.id === loggedInUserId
            );
            const updatedMember = {
              accepted: true,
              clinic: {
                ...acceptedClinic.members[memberIdx].clinic,
                type: ClinicType.Group,
                isActivated: true,
              },
              id: acceptedClinic.members[memberIdx].id,
              manager: acceptedClinic.members[memberIdx].manager,
              user: acceptedClinic.members[memberIdx].user,
              staying: true,
              isActivate: true,
            };

            client.cache.updateQuery<FindMyClinicsQuery>(
              {
                query: FIND_MY_CLINICS_DOCUMENT,
                variables: { input: { includeInactivate: true } },
              },
              (cacheData) => {
                if (!cacheData || !cacheData.findMyClinics.clinics)
                  return cacheData;

                const clinicIdx = cacheData.findMyClinics.clinics.findIndex(
                  (clinic) => clinic.id === updatedMember.clinic.id
                );
                const clinic = cacheData.findMyClinics.clinics[clinicIdx];
                const memberIndex = clinic.members.findIndex(
                  (member) => member.id === updatedMember.id
                );

                const updatedClinic = {
                  ...clinic,
                  members: changeValueInArray(
                    clinic.members,
                    updatedMember,
                    memberIndex
                  ),
                };

                return {
                  ...cacheData,
                  findMyClinics: {
                    ...cacheData.findMyClinics,
                    clinics: changeValueInArray(
                      cacheData.findMyClinics.clinics.map((clinic) => ({
                        ...clinic,
                        isActivated: false,
                      })),
                      updatedClinic,
                      clinicIdx
                    ),
                  },
                };
              }
            );

            client.cache.updateQuery<MeQuery>(
              {
                query: ME_DOCUMENT,
              },
              (cacheData) => {
                if (!cacheData || !cacheData.me || !cacheData.me.members)
                  return cacheData;

                const memberIdx = cacheData.me.members.findIndex(
                  (member) => member.id === updatedMember.id
                );
                return {
                  me: {
                    ...cacheData.me,
                    members: changeValueInArray(
                      cacheData.me.members,
                      updatedMember,
                      memberIdx
                    ),
                  },
                };
              }
            );
          }
        },
      });
    }
  };

  return {
    acceptInvitation,
    loading,
    clinicName,
    selectedClinicId,
    memberId,
  };
}
