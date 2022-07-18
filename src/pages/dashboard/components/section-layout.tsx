import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cls } from "../../../libs/utils";

interface DashboardSectionLayoutProps {
  children: React.ReactNode;
  title?: string;
  width?: "md";
  tooltip?: string;
  height?: string;
  hasMinHeight?: boolean;
  hasBorder?: boolean;
  hasShadow?: boolean;
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
  hasMinHeight,
  hasBorder,
  hasShadow,
  elementName,
  padding,
  moreYGap,
  heightFull,
}: DashboardSectionLayoutProps) => {
  return (
    <div
      className={cls(
        elementName || "",
        "DASHBOARD-SECTION-LAYOUT w-full bg-white p-2",
        hasShadow ? "shadow" : "",
        hasBorder ? "border" : "",
        hasMinHeight ? "min-h-[8rem]" : "",
        padding ? "my-2" : "",
        heightFull ? "h-full" : ""
      )}
      style={{ ...(height && { height }) }}
    >
      <div
        className={cls(
          "overflow-x-scroll",
          width === "md" ? "mx-auto max-w-md" : "w-full",
          moreYGap ? "space-y-6" : "space-y-2"
        )}
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
