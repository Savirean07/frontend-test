import { twMerge } from "tailwind-merge";
import MarkdownToHTML from "../markdown";
import WindowHeader, { IWindowHeaderProps } from "../window.header";
import { TextAnimationProps } from "src/components/animation";
import { useState } from "react";
import { MdMailOutline } from "react-icons/md";

interface ReportsViewProps extends IWindowHeaderProps {
  content: string;
  animationProps?: TextAnimationProps;
  icon?: React.ReactNode;
  iconColor?: string;
  time?: string;
}

const ReportsView = (props: ReportsViewProps) => {
  const {
    content,
    animationProps,
    icon,
    iconColor,
    time,
    ...windowHeaderProps
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="flex flex-row justify-center items-start gap-2 self-start max-w-[calc(100%-42px)] w-full animate-grow-x">
        <div className="flex flex-col justify-center items-center gap-2 relative self-stretch">
          <span
            className={twMerge(
              "text-xl rounded-full p-2 bg-black/50 relative",
              iconColor
            )}
          >
            {icon ? icon : <MdMailOutline />}

            <span
              className={twMerge(
                "absolute top-1/2 -right-2 -translate-y-1/2 w-2 h-1",
                iconColor
              )}
            ></span>
          </span>
          <div className={twMerge("w-1 h-full -mt-2", iconColor)}></div>
        </div>
        <div className="w-full mb-4">
          <div
            className={twMerge(
              "w-full flex flex-col justify-center items-center border-green-500/10 rounded-xl border",
              iconColor, "text-white bg-black/50"
            )}
          >
            <WindowHeader
              {...windowHeaderProps}
              isOpen={isOpen}
              onOpen={() => setIsOpen(true)}
              onClose={() => setIsOpen(false)}
            >
              {isOpen && (
                <div className={twMerge("w-full", isOpen ? "p-4" : "p-0")}>
                  <MarkdownToHTML
                    animationProps={{
                      text: content,
                      animate: true,
                      pace: 100,
                      speed: 3,
                      ...animationProps,
                    }}
                  />
                </div>
              )}
            </WindowHeader>
          </div>
          <div className="flex flex-row items-center justify-end gap-2 mt-1 mr-2 self-end">
            <p className="text-xs text-white/50 flex flex-row items-center gap-2">
              {time}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsView;
