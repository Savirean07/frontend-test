import { twMerge } from "tailwind-merge";
import { TextAnimation } from "../animation";
import { IconButton } from "./button";
import {
  MdCheckCircleOutline,
  MdClose,
  MdContentCopy,
  MdOpenInFull,
} from "react-icons/md";
import { useEffect, useRef, useState } from "react";

export interface IWindowHeaderProps {
  headingText?: string;
  isOpen?: boolean;
  isEmailWindow?: boolean;
  isCopied?: boolean;
  isEditing?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onCopy?: () => void;
  onEdit?: () => void;
  showControls?: boolean;
  children?: React.ReactNode;
  buttonsNode?: React.ReactNode;
  disableClose?: boolean;
}
const WindowHeader = ({
  headingText,
  isOpen,
  isCopied,
  onOpen,
  onClose,
  onCopy,
  showControls = false,
  buttonsNode,
  children,
  disableClose,
}: IWindowHeaderProps) => {
  const [isCopiedText, setIsCopiedText] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsCopiedText(false);
  }, [isCopied]);
  return (
    <div className="w-full">
      <div
        className={twMerge(
          "text-sm text-white/30 bg-black/50 p-2 flex flex-row items-center justify-between gap-2 group w-full",
          isOpen ? "rounded-t-xl" : "rounded-xl"
        )}
      >
        <TextAnimation
          text={headingText || "Unknown Response"}
          contentRenderer={({ text }) => <p>{text}</p>}
        />
        {showControls ? (
          <div>
            {!isOpen ? (
              <IconButton
                text="Open"
                icon={<MdOpenInFull size={14} />}
                onClick={onOpen}
                color="green"
              />
            ) : (
              <div className="flex flex-row items-center gap-2">
                {buttonsNode}
                <IconButton
                  text={isCopiedText ? "Copied" : "Copy"}
                  icon={
                    isCopiedText ? <MdCheckCircleOutline /> : <MdContentCopy />
                  }
                  color={isCopiedText ? "green" : "blue"}
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(String(children));
                    } else {
                      console.error("Clipboard not supported");
                    }
                    setIsCopiedText(true);
                    if (timerRef.current) {
                      clearTimeout(timerRef.current);
                    }
                    timerRef.current = setTimeout(() => {
                      setIsCopiedText(false);
                    }, 10000);
                    onCopy?.();
                  }}
                />
                <IconButton
                  text="Close"
                  icon={<MdClose size={14} />}
                  onClick={onClose}
                  color="red"
                  disabled={disableClose}
                />
              </div>
            )}
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
};

export default WindowHeader;
