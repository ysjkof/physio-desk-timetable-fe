import { client } from '../../../../apollo';
import { Worning } from '../../../../components/atoms/Warning';
import { Button } from '../../../../components/molecules/Button';
import {
  FindMyClinicsDocument,
  FindMyClinicsQuery,
  MeDocument,
  useAcceptInvitationMutation,
  MeQuery,
  ClinicType,
} from '../../../../graphql/generated/graphql';
import useStore from '../../../../hooks/useStore';
import { toastVar } from '../../../../store';
import { ISelectedClinic } from '../../../../types/type';
import { changeValueInArray } from '../../../../utils/utils';

interface AcceptInvitationProps {
  selectedClinic: ISelectedClinic;
  loggedInUserId: number;
}

export default function AcceptInvitation({
  selectedClinic,
  loggedInUserId,
}: AcceptInvitationProps) {
  const [acceptInvitationMutation, { loading }] = useAcceptInvitationMutation();
  const { selectedInfo } = useStore();

  const acceptInvitation = (clinicId: number | undefined) => {
    if (clinicId && confirm('초대를 수락합니다')) {
      acceptInvitationMutation({
        variables: {
          input: {
            clinicId,
          },
        },
        onCompleted(data) {
          if (data.acceptInvitation.ok) {
            toastVar({ message: '병원 초대를 수락했습니다' });

            const memberIdx = selectedClinic.members.findIndex(
              (member) => member.user.id === loggedInUserId
            );
            const updatedMember = {
              accepted: true,
              clinic: {
                ...selectedClinic.members[memberIdx].clinic,
                type: ClinicType.Group,
                isActivated: true,
              },
              id: selectedClinic.members[memberIdx].id,
              isActivate: selectedClinic.members[memberIdx].isActivate,
              manager: selectedClinic.members[memberIdx].manager,
              staying: true,
              user: selectedClinic.members[memberIdx].user,
            };

            client.cache.updateQuery<FindMyClinicsQuery>(
              {
                query: FindMyClinicsDocument,
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
                      cacheData.findMyClinics.clinics,
                      updatedClinic,
                      clinicIdx
                    ),
                  },
                };
              }
            );

            client.cache.updateQuery<MeQuery>(
              {
                query: MeDocument,
              },
              (cacheData) => {
                if (!cacheData || !cacheData.me || !cacheData.me.members)
                  return cacheData;

                const memberIdx = cacheData.me.members!.findIndex(
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

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Worning>
        {selectedInfo.clinic?.name}에 초대됐습니다. 초대 수락을 하면 병원의
        기능을 사용할 수 있습니다.
      </Worning>
      <Button
        canClick
        type="button"
        loading={loading}
        onClick={() => acceptInvitation(selectedInfo.clinic?.id)}
      >
        수락하기
      </Button>
    </div>
  );
}
