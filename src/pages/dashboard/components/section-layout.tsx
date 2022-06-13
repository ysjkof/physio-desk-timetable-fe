import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface DashboardSectionLayoutProps {
  children: React.ReactNode;
  title?: string;
  width?: "md";
  tooltip?: string;
  height?: string;
  elementName?: string;
  padding?: boolean;
  moreYGap?: boolean;
  heightFull?: boolean;
}

export const DashboardSectionLayout = ({
  children,
  title,
  width,
  tooltip,
  height,
  elementName,
  padding,
  moreYGap,
  heightFull,
}: DashboardSectionLayoutProps) => {
  return (
    <div
      className={`${
        elementName ?? ""
      } dashboard-section-layout w-full overflow-y-scroll bg-white p-2 shadow-cst ${
        padding ? " m-2" : ""
      }${heightFull ? " h-full" : ""}`}
      style={{ ...(height && { height }) }}
    >
      <div
        className={`${width === "md" ? " mx-auto max-w-md" : " w-full"}${
          moreYGap ? " space-y-6" : " space-y-2"
        }`}
      >
        {tooltip && (
          <h3 className="group relative">
            <span className="mb-4 text-sm font-semibold">{title}</span>
            {tooltip && (
              <>
                <FontAwesomeIcon icon={faCircleQuestion} className="ml-1" />
                <p className="bubble-arrow-t-left absolute top-8 z-50 hidden rounded-md bg-black px-3 py-2 text-white group-hover:block">
                  {tooltip}
                </p>
              </>
            )}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
};
