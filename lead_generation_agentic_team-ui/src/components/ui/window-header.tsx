import { MdClose, MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { ReactNode, useEffect, useState } from "react";
import { IconButton, IconButtonProps } from "./button";
import { twMerge } from "tailwind-merge";

interface WindowHeaderProps {
  onClose: () => void;
  title: string;
  closeButton?: boolean;
  closeButtonColor?: IconButtonProps["color"];
  closeButtonText?: string;
  closeButtonIcon?: ReactNode;
  showCloseButtonIcon?: boolean;
  icon: ReactNode;
  onExpand?: (isMaximized: boolean) => void;
  isExpanded?: boolean;
  onSearch?: (searchValue: string) => void;
  class?: {
    container?: string;
    titleBar?: string;
    buttonContainer?: string;
    iconContainer?: string;
  };
}

const WindowHeaderBar = ({
  class: { container, titleBar, buttonContainer, iconContainer } = {},
  onClose,
  title,
  icon,
  closeButton = true,
  closeButtonColor = "red",
  closeButtonText = "Close",
  closeButtonIcon = <MdClose />,
  showCloseButtonIcon = false,
  onExpand,
  isExpanded = false,
  onSearch,
}: WindowHeaderProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleMaximize = () => {
    onExpand?.(!isMaximized);
    if (!isExpanded) {
      setIsMaximized((prev) => !prev);
    }
  };

  useEffect(() => {
    setIsMaximized(!!isExpanded);
  }, [isExpanded]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(searchValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  return (
    <div
      className={twMerge(
        "flex justify-between items-center gap-2 bg-white/10 p-2 rounded-t-2xl",
        container
      )}
    >
      <p
        className={twMerge("text-sm text-white/50 flex items-center", titleBar)}
      >
        <span
          className={twMerge(
            "mr-2 bg-green-500/30 text-green-500 p-1 rounded-md",
            iconContainer
          )}
        >
          {icon}
        </span>
        {title}
      </p>
      <div className={twMerge("flex items-center gap-2", buttonContainer)}>
        {onSearch && (
          <div className="flex items-center gap-2">
            <input
              type="search"
              name=""
              id=""
              placeholder="Find"
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              className="bg-white/10 rounded-md p-1 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300 text-sm placeholder:text-sm"
            />
          </div>
        )}
        {onExpand && (
          <IconButton
            icon={!isMaximized ? <MdFullscreen /> : <MdFullscreenExit />}
            text={!isMaximized ? "Maximize" : "Minimize"}
            onClick={handleMaximize}
            color="green"
          />
        )}
        {closeButton && (
          <IconButton
            icon={closeButtonIcon}
            text={closeButtonText}
            onClick={onClose}
            hideIcon={!showCloseButtonIcon}
            color={closeButtonColor}
          />
        )}
      </div>
    </div>
  );
};

export default WindowHeaderBar;
