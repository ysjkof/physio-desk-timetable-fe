interface DashboardTitleProps {
  name: string;
  subText: string;
  children?: React.ReactNode;
}

export const DashboardTitle = ({
  name,
  subText,
  children,
}: DashboardTitleProps) => {
  return (
    <h2 className="mb-3 bg-white pl-4 pt-2 pb-1.5 shadow-cst">
      <span className="font-semibold">{name}</span>
      <span className="">{subText}</span>
      {children}
    </h2>
  );
};
