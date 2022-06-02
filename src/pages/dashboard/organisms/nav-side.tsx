import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import {
  checkIsManager,
  getIsStayed,
  ModifiedClinic,
  selectedMe,
  SelectedMenuType,
} from "..";
import { ModalTemplate } from "../../../components/molecules/modal-template";
import {
  MeQuery,
  useFindMyClinicsQuery,
} from "../../../graphql/generated/graphql";
import { getPositionRef } from "../../../libs/utils";
import { DashboardNavList } from "../components/dashboadr-nav-list";
import { ClinicName } from "../molecules/clinicName";

interface DashboardSideNavProps {
  selectedClinic: ModifiedClinic;
  selectedMenu: SelectedMenuType;
  setSelectedMenu: React.Dispatch<React.SetStateAction<SelectedMenuType>>;
  setSelectedClinic: React.Dispatch<React.SetStateAction<ModifiedClinic>>;
  meData: MeQuery;
}

export const DashboardSideNav = ({
  selectedClinic,
  selectedMenu,
  setSelectedMenu,
  setSelectedClinic,
  meData,
}: DashboardSideNavProps) => {
  const [openClinicSelect, setOpenClinicSelect] = useState(false);
  const { data: findMyClinics, loading } = useFindMyClinicsQuery({
    variables: { input: { includeInactivate: true } },
  });
  const ref = useRef<HTMLDivElement>(null);
  const [top, left] = getPositionRef(ref, 0);

  return (
    <nav className="dashboard-side-nav h-full space-y-2">
      <div
        className="btn-menu flex h-8 cursor-pointer items-center justify-between gap-2  rounded-none border-b px-2 py-2 text-sm font-semibold"
        onClick={() => setOpenClinicSelect((prev) => !prev)}
        ref={ref}
      >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {selectedClinic.name}
        </span>
        <FontAwesomeIcon icon={faChevronDown} fontSize={14} />
        {openClinicSelect && (
          <ModalTemplate
            top={top}
            left={left}
            onClick={() => setOpenClinicSelect}
            children={
              <ul className="w-[250px] divide-y overflow-hidden rounded-md bg-white text-xs font-normal shadow-cst">
                <li
                  className={`btn-menu relative cursor-pointer py-1.5 px-6 ${
                    selectedClinic.id === 0 ? "font-semibold" : ""
                  }`}
                  onClick={() => {
                    setSelectedClinic(selectedMe);
                  }}
                >
                  {selectedMe.name}
                </li>
                {findMyClinics?.findMyClinics.clinics?.map((clinic) => (
                  <ClinicName
                    key={clinic.id}
                    clinic={clinic}
                    selectedClinic={selectedClinic}
                    meData={meData}
                    onClick={() => {
                      setSelectedClinic({
                        ...clinic,
                        isManager: checkIsManager(clinic.id, meData),
                        isStayed: getIsStayed(clinic.id, meData),
                      });
                    }}
                  />
                ))}
              </ul>
            }
          />
        )}
      </div>
      <ul>
        <DashboardNavList
          type={"member"}
          selectedClinic={selectedClinic}
          selectedMenu={selectedMenu}
          onClick={() => setSelectedMenu("member")}
        />
        <DashboardNavList
          type={"invite"}
          selectedClinic={selectedClinic}
          selectedMenu={selectedMenu}
          onClick={() => setSelectedMenu("invite")}
        />
        <DashboardNavList
          type={"inactivate"}
          selectedClinic={selectedClinic}
          selectedMenu={selectedMenu}
          onClick={() => setSelectedMenu("inactivate")}
        />
        <div className="seperate-bar mb-2 pt-2" />
        <DashboardNavList
          type={"prescription"}
          selectedClinic={selectedClinic}
          selectedMenu={selectedMenu}
          onClick={() => setSelectedMenu("prescription")}
        />
        <DashboardNavList
          type={"statistics"}
          selectedClinic={selectedClinic}
          selectedMenu={selectedMenu}
          onClick={() => setSelectedMenu("statistics")}
        />
        <div className="seperate-bar mb-2 pt-2" />
        <DashboardNavList
          type={"create"}
          selectedClinic={selectedClinic}
          selectedMenu={selectedMenu}
          onClick={() => setSelectedMenu("create")}
        />
        <DashboardNavList
          type={"inactivated"}
          selectedClinic={selectedClinic}
          selectedMenu={selectedMenu}
          onClick={() => setSelectedMenu("inactivated")}
        />
      </ul>
    </nav>
  );
};
