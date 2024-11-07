import { useState } from "react";
import Button from "../button";
import { MdTerminal } from "react-icons/md";

interface PromptViewProps {
  onSubmitPrompt: (prompt: string) => void;
  placeholder?: string;
  title?: string;
}

const PromptInputView = ({
  onSubmitPrompt,
  placeholder,
  title,
}: PromptViewProps) => {
  const [prompt, setPrompt] = useState<string>("");

  const handleSubmitPrompt = (prompt: string) => {
    onSubmitPrompt(prompt);
  };

  return (
    <>
      <div className="w-fit border border-green-500/20 rounded-xl bg-black/30 ease-in-out duration-300">
        <div className="text-sm text-white/50 bg-black/50 rounded-t-xl p-2 flex flex-row items-center justify-between gap-2">
          <p className="flex flex-row items-center gap-2">
            <span className="text-green-500 bg-green-500/30 p-1 rounded-md">
              <MdTerminal />
            </span>
            {title || "Prompt"}
          </p>
        </div>
        <div className="p-4 min-h-fit text-sm">
          <textarea
            cols={50}
            rows={10}
            placeholder={placeholder || "Enter your prompt here..."}
            className="w-full bg-black/50 rounded-md p-2"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
          <div className="flex flex-row items-center gap-2 mt-4 justify-end">
            <Button
              disabled={prompt.length > 0}
              onClick={() => handleSubmitPrompt("exit")}
              className="rounded-md bg-red-700 px-4 py-1 disabled:opacity-20"
            >
              Exit
            </Button>
            <Button
              className="rounded-md bg-green-700 px-4 py-1 disabled:opacity-20"
              onClick={() =>
                handleSubmitPrompt(prompt.length > 0 ? prompt : "")
              }
            >
              {prompt.length > 0 ? "Send" : "Enter"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PromptInputView;
