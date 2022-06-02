import { ModifiedClinic } from "..";
import { MeQuery } from "../../../graphql/generated/graphql";

interface Member {
  __typename?: "Member";
  id: number;
  staying: boolean;
  manager: boolean;
  accepted: boolean;
  user: { __typename?: "User"; id: number; name: string };
  clinic: { __typename?: "Clinic"; id: number; name: string };
}
interface Clinic {
  __typename?: "Clinic";
  id: number;
  name: string;
  isActivated: boolean;
  members: Member[];
}

interface ClinicNameProps {
  selectedClinic: ModifiedClinic;
  clinic: Clinic;
  meData: MeQuery;
  onClick: () => void;
}

export const ClinicName = ({
  selectedClinic,
  clinic,
  meData,
  onClick,
}: ClinicNameProps) => {
  return (
    <li
      className={`btn-menu border-sm relative cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-none py-1.5 px-6 ${
        selectedClinic.id === clinic.id ? "font-semibold" : ""
      } ${
        clinic.members.find(
          (member) =>
            member.user.id === meData?.me.id &&
            !member.accepted &&
            !member.staying
        )
          ? "after: opacity-90 after:ml-0.5 after:rounded-full after:bg-white after:px-2 after:content-['!']"
          : ""
      }`}
      onClick={() => onClick()}
    >
      {clinic.name}
    </li>
  );
};
