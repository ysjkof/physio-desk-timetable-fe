import { useRef } from "react";
import { checkIsManager, getIsStayed, ModifiedClinic } from "..";
import {
  MeQuery,
  useFindMyClinicsQuery,
} from "../../../graphql/generated/graphql";

interface DashboardTopNavProps {
  clinicId: number;
  setSelectedClinic: React.Dispatch<React.SetStateAction<ModifiedClinic>>;
  meData: MeQuery;
}
export const DashboardTopNav = ({
  clinicId,
  setSelectedClinic,
  meData,
}: DashboardTopNavProps) => {
  const selectedMe = {
    id: 0,
    name: "나",
    isManager: true,
    isActivated: true,
    isStayed: true,
  };
  const { data: findMyClinics, loading } = useFindMyClinicsQuery({
    variables: { input: { includeInactivate: true } },
  });

  const ref = useRef<HTMLUListElement>(null);
  return (
    <nav className="dashboard-top-nav col-start-2">
      <ul className="flex h-full items-center bg-blue-400/90 px-2" ref={ref}>
        <li
          className={`cursor-pointer py-1.5 px-6 ${
            clinicId === 0
              ? "rounded-md bg-white font-semibold text-blue-800"
              : "text-white"
          }`}
          onClick={() => {
            setSelectedClinic(selectedMe);
          }}
        >
          나
        </li>
        {findMyClinics?.findMyClinics.clinics?.map((clinic) => (
          <li
            key={clinic.id}
            className={`relative cursor-pointer py-1.5 px-6 ${
              clinicId === clinic.id
                ? "rounded-md bg-white font-bold text-blue-800"
                : "text-white"
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
            onClick={() => {
              setSelectedClinic({
                ...clinic,
                isManager: checkIsManager(clinic.id, meData),
                isStayed: getIsStayed(clinic.id, meData),
              });
            }}
          >
            {clinic.name}
          </li>
        ))}
      </ul>
    </nav>
  );
};
