import { twMerge } from "tailwind-merge";
import MarkdownToHTML from "../markdown";
import { MdLinkOff } from "react-icons/md";

interface ITerminateViewProps {
  message: string;
}

const TerminateView = ({ message }: ITerminateViewProps) => {
  return (
    <div className="flex flex-row gap-2 self-start max-w-[calc(100%-42px)] w-full animate-grow-left">
      <div className="flex flex-col justify-center items-center gap-2 relative self-stretch">
        <span className="text-emerald-500 text-lg bg-emerald-500/10 p-2 rounded-full self-start relative">
          <MdLinkOff />
          <span className="absolute top-1/2 -right-2 -translate-y-1/2 w-2 h-1 bg-emerald-500/10 rounded-full"></span>
        </span>
        <div className={twMerge("w-1 h-full -mt-2")}></div>
      </div>
      <div className="w-full mb-4">
        <div className="grow bg-emerald-500/10 rounded-xl p-2 text-white/80">
          <MarkdownToHTML
            animationProps={{
              text: message,
              pace: 1,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TerminateView;
