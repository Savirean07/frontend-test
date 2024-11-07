import { useEffect, useState } from "react";
import { IoSendSharp, IoStop } from "react-icons/io5";

interface PromptInputProps {
  onSubmit: (query: string) => void;
  inputPrompt?: string;
  disabled?: boolean;
  onClose: () => void;
}

const PromptInput = (props: PromptInputProps) => {
  const { onSubmit, inputPrompt, disabled, onClose } = props;
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!inputPrompt) return;
    setQuery(inputPrompt);
  }, [inputPrompt]);

  return (
    <div className="w-full sm:bottom-6 bottom-4 px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(query);
        }}
        className="flex justify-center items-center gap-2 outline-1 focus:shadow-2xl shadow-black bg-black p-2 px-4 py-2 rounded-3xl border focus:outline-black-800 border-black-800 ease-in-out duration-100 w-full max-w-2xl h-fit m-auto"
      >
        <textarea
          disabled={disabled}
          style={{ resize: "none" }}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setQuery(e.target.value);
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
            e.target.style.height = "20px";
            e.target.scrollTop = 0;
            e.target.parentElement?.classList.add("outline-none");
            e.target.parentElement?.classList.remove("outline");
          }}
          onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => {
            e.target.style.height = e.target.scrollHeight + "px";
            e.target.parentElement?.classList.add("outline");
            e.target.parentElement?.classList.remove("outline-none");
          }}
          id="queryTextArea"
          className="group min-h-5 max-h-28 bg-transparent outline-none text-sm w-full scrollbar-hidden disabled:opacity-50"
          rows={1}
          value={query}
          onKeyDown={(
            e: React.KeyboardEvent<HTMLTextAreaElement> & {
              target: HTMLTextAreaElement;
            }
          ) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e.target.value);
            }
          }}
          placeholder="Ask me anything..."
        ></textarea>
        {disabled ? (
          <button
            about="cancel query"
            type="button"
            onClick={onClose}
            className="text-sm hover:text-rose-500 active:text-rose-400 pointer-events-auto opacity-100 relative flex"
          >
            <IoStop />
            <span className="absolute w-7 h-7 border-x-green-500 border-y-transparent border-2 animate-spin rounded-full -top-[7px] -left-[7px] "></span>
          </button>
        ) : (
          <button
            about="submit query"
            disabled={disabled}
            type="submit"
            className="text-sm hover:text-rose-500 active:text-rose-400"
          >
            <IoSendSharp />
          </button>
        )}
      </form>
    </div>
  );
};

export default PromptInput;
