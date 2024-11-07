import { BiLoader } from "react-icons/bi";
import {
  MdAccountCircle,
  MdDone,
  MdError,
  MdGamepad,
  MdInfo,
  MdStop,
  MdWarning,
  MdWatchLater,
} from "react-icons/md";
import { PiNetworkFill, PiNetworkSlashFill } from "react-icons/pi";
import { useMsal } from "src/auth";
import { IconButton } from "src/components/ui";
import { IprogressStatus } from "src/utils";
import { twMerge } from "tailwind-merge";

const messageTheme = {
  info: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  error: "text-red-500 bg-red-500/10 border-red-500/20",
  success: "text-green-500 bg-green-500/10 border-green-500/20",
  default: "text-white/50 bg-black/30 border-black/50",
  warning: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
};

const messageIcons = {
  info: {
    icon: <MdInfo className="text-blue-500" />,
    bg: "bg-blue-500/10",
    className: "text-blue-500 bg-blue-500/10",
  },
  error: {
    icon: <MdError className="text-red-500" />,
    bg: "bg-red-500/10",
    className: "text-red-500 bg-red-500/10",
  },
  success: {
    icon: <MdDone className="text-green-500" />,
    bg: "bg-green-500/10",
    className: "text-green-500 bg-green-500/10",
  },
  default: {
    icon: <MdWarning className="text-white/50" />,
    bg: "bg-black/30",
    className: "text-white/50 bg-black/30",
  },
  warning: {
    icon: <MdWarning className="text-yellow-500" />,
    bg: "bg-yellow-500/10",
    className: "text-yellow-500 bg-yellow-500/10",
  },
};

interface TopBarProps {
  progressStatus?: IprogressStatus;
  errorMessage?: string;
  onStop?: () => void;
  isConnected?: boolean;
  message?: string;
  type?: "info" | "error" | "success" | "default" | "warning";
  handleDisconnect: () => void;
  handleConnect: () => void;
}

const TopBar = ({
  progressStatus = "initial",
  errorMessage,
  onStop,
  isConnected = false,
  message = "",
  type = "default",
  handleDisconnect,
  handleConnect,
}: TopBarProps) => {
  const { msalInstance } = useMsal();
  return (
    <div className="flex flex-row items-center justify-between gap-2 px-4  text-gray-500 text-sm bg-black/30">
      <div className="flex flex-row items-center gap-2 mx-2 h-14 border-r-2 border-black/50 pr-6">
        <div className="flex flex-row items-center gap-2">
          <MdAccountCircle size={24} />
          {msalInstance?.getActiveAccount()?.name || "guest"}
        </div>
      </div>
      {message && (
        <div className="flex flex-row items-center gap-2 max-w-5xl">
          <p
            className={twMerge(
              "text-sm  p-1 rounded-md flex flex-row items-center gap-2 border",
              messageTheme[type]
            )}
          >
            <span
              className={twMerge(
                "p-1 rounded-md",
                messageIcons[type].className
              )}
            >
              {messageIcons[type].icon}
            </span>
            <span className="line-clamp-2">{message}</span>
          </p>
        </div>
      )}
      <div className="flex flex-row items-center gap-2 self-start">
        <div className="flex flex-row items-center gap-2 h-14 border-l-2 border-black/50 pl-2 text-lg">
          {progressStatus === "in_progress" ? (
            <BiLoader title="Generating" className="animate-spin text-white" />
          ) : progressStatus === "success" ? (
            <MdDone title="Success" className="text-green-500" />
          ) : progressStatus === "error" ? (
            <MdError
              title={errorMessage || "Something went wrong"}
              className="text-red-500"
            />
          ) : progressStatus === "idle" ? (
            <MdGamepad title="Idle" className="text-white" />
          ) : progressStatus === "waiting" ? (
            <MdWatchLater title="Waiting for response" className="text-white" />
          ) : null}
          <span
            title={isConnected ? "Connected" : "Disconnected"}
            className={twMerge(
              "text-xs p-1 rounded-md ease-in-out duration-300"
            )}
          >
            {isConnected ? (
              <PiNetworkFill
                onClick={handleDisconnect}
                size={16}
                className="text-green-500 cursor-pointer"
              />
            ) : (
              <PiNetworkSlashFill
                onClick={handleConnect}
                size={16}
                className="text-red-500 cursor-pointer"
              />
            )}
          </span>
        </div>
        <IconButton
          hidden={progressStatus !== "in_progress"}
          text="Stop"
          icon={<MdStop />}
          onClick={onStop || (() => {})}
          color="red"
        />
      </div>
    </div>
  );
};

export default TopBar;
