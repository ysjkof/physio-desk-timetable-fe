import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface DashboardSectionLayoutProps {
  title: string;
  children: React.ReactNode;
  tooltip?: string;
}

export const DashboardSectionLayout = ({
  title,
  children,
  tooltip,
}: DashboardSectionLayoutProps) => {
  return (
    <div className="flex h-full w-full flex-col space-y-2 bg-white p-2 shadow-cst">
      {title && !tooltip && <h3>{title}</h3>}
      {tooltip && (
        <h3 className="group relative">
          {title} <FontAwesomeIcon icon={faCircleQuestion} />
          <p className="bubble-arrow-t-left absolute top-8 z-50 hidden rounded-md bg-black px-3 py-2 text-white group-hover:block">
            {tooltip}
          </p>
        </h3>
      )}
      {children}
    </div>
  );
};
