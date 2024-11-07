import { twMerge } from "tailwind-merge";
import { MdSearch } from "react-icons/md";
import FileSection from "./file-section";
import { Link } from "react-router-dom";

const SideSection = ({
  title,
  icon,
  colorTheme,
  hidden,
  children,
  fileSectionProps,
}: {
  title?: string;
  icon?: React.ReactNode;
  hidden?: {
    fileSection?: boolean;
  };
  colorTheme?: {
    bgColor?: string;
    textColor?: string;
    iconColor?: string;
  };
  children?: React.ReactNode;
  fileSectionProps?: Omit<React.ComponentProps<typeof FileSection>, "ref">;
}) => {
  return (
    <div
      className={twMerge(
        "transition-all duration-300 overflow-hidden relative w-80 resize-x overflow-x-hidden flex flex-col"
      )}
    >
      <Link to="/roles">
        <div
          className={twMerge(
            "flex flex-row items-center gap-2 p-4 font-cascade bg-green-500/20",
            colorTheme?.bgColor
          )}
        >
          <span
            className={twMerge(
              "text-green-500 bg-green-500/20 p-1 rounded-md",
              colorTheme?.iconColor,
              colorTheme?.bgColor
            )}
          >
            {icon || <MdSearch />}
          </span>
          <span className={twMerge("text-white", colorTheme?.textColor)}>
            {title || "Wingman Outreach"}
          </span>
        </div>
      </Link>
      <div className="flex flex-col gap-2 mt-4 font-cascade flex-1 relative">
        {!hidden?.fileSection && <FileSection {...fileSectionProps} />}
        {children}
      </div>
    </div>
  );
};

export default SideSection;
