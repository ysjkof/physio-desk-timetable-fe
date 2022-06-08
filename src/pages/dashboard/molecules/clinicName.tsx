interface ClinicNameProps {
  clinicName: string;
  isSelected: boolean;
  memberState: "탈퇴" | "수락대기" | "직원" | null;
  onClick: () => void;
}

export const ClinicName = ({
  clinicName,
  isSelected,
  memberState,
  onClick,
}: ClinicNameProps) => {
  return (
    <li
      className={`btn-menu border-sm relative cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-none py-1.5 px-6${
        isSelected ? " font-semibold" : ""
      } ${
        memberState === "직원"
          ? ""
          : "after: opacity-90 after:ml-0.5 after:rounded-full after:bg-white after:px-2 after:content-['!']"
      }`}
      onClick={() => onClick()}
    >
      {clinicName}
    </li>
  );
};
