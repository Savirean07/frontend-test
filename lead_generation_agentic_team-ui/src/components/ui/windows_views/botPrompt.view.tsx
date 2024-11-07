import { MdTerminal } from "react-icons/md";
import MarkdownToHTML from "../markdown";
import moment from "moment";
import { twMerge } from "tailwind-merge";

interface BotPromptViewProps {
  content: string;
  timestamp?: number;
}

const BotPromptView = ({ content, timestamp }: BotPromptViewProps) => {
  const time = moment(timestamp || Date.now()).format("DD/MM/YYYY HH:mm:ss");
  return (
    <>
      <div className="flex flex-row gap-2 self-start max-w-[calc(100%-42px)] w-full animate-grow-left">
        <div className="flex flex-col justify-center items-center gap-2 relative self-stretch">
          <span className="text-indigo-500 text-lg bg-indigo-500/10 p-2 rounded-full self-start relative">
            <MdTerminal />
            <span className="absolute top-1/2 -right-2 -translate-y-1/2 w-2 h-1 bg-indigo-500/10 rounded-full"></span>
          </span>
          <div
            className={twMerge("w-1 h-full -mt-2", "bg-indigo-500/10")}
          ></div>
        </div>
        <div className="w-full mb-4">
          <div className="grow bg-black/50 rounded-xl p-2 text-white/50">
            <MarkdownToHTML
              animationProps={{
                text: content,
                pace: 1,
              }}
            />
          </div>
          <div className="flex flex-row items-center justify-end gap-2 mt-2">
            <p className="text-xs text-white/50 flex flex-row items-center gap-2">
              {time}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BotPromptView;
