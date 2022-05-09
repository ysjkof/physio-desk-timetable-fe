import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cls } from "../../../libs/utils";

interface DashboardSectionLayoutProps {
  children: React.ReactNode;
  title?: string;
  width?: "md";
  tooltip?: string;
}

export const DashboardSectionLayout = ({
  children,
  title,
  width,
  tooltip,
}: DashboardSectionLayoutProps) => {
  return (
    <div className="h-full w-full bg-white p-2 shadow-cst">
      <div
        className={cls(
          "w-full space-y-2",
          width ? "mx-auto" : "",
          width === "md" ? "max-w-md" : ""
        )}
      >
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
    </div>
  );
};
