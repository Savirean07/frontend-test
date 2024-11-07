import { useEffect, useState } from "react";
import { IoSendSharp, IoStop } from "react-icons/io5";

/**
 * @param {Object} props
 * @param {(prompt: String) => string} props.onSubmit
 * @param {String} [props.inputPrompt]
 * @param {Boolean} props.disabled
 * @param {(event: MouseEventHandler<HTMLButtonElement>) => void} [props.onClose]
 * @returns {JSX.Element}
 */

export const UserRequestForm = (props) => {
  const { onSubmit, inputPrompt, disabled, onClose } = props;
  const [query, setQuery] = useState(inputPrompt);

  useEffect(() => {
    if (!inputPrompt) return;
    setQuery(inputPrompt);
  }, [inputPrompt]);

  return (
    <div className="w-full absolute sm:bottom-6 bottom-4 px-4">
      <form
        aria-busy={disabled}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(query);
        }}
        className="flex justify-center items-center gap-2 outline-1 shadow-2xl shadow-black bg-black p-2 px-4 py-2 rounded-3xl border aria-busy:outline-black-800 border-black-800 ease-in-out duration-100 w-full max-w-2xl h-fit m-auto"
      >
        <textarea
          disabled={disabled}
          style={{ resize: "none" }}
          onChange={(e) => {
            setQuery(e.target.value);
            document.getElementById("queryTextArea").style.height =
              e.target.scrollHeight + "px";
          }}
          onBlur={(e) => {
            e.target.style.height = "20px";
            document.getElementById("queryTextArea").scrollTop = 0;
            document
              .getElementById("queryTextArea")
              .parentElement.classList.add("outline-none");
            document
              .getElementById("queryTextArea")
              .parentElement.classList.remove("outline");
          }}
          onFocus={(e) => {
            e.target.style.height = e.target.scrollHeight + "px";
            document
              .getElementById("queryTextArea")
              .parentElement.classList.add("outline");
            document
              .getElementById("queryTextArea")
              .parentElement.classList.remove("outline-none");
          }}
          id="queryTextArea"
          className="group min-h-5 max-h-28 bg-transparent outline-none text-sm w-full scrollbar-hidden disabled:opacity-50"
          rows={1}
          value={query}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e.target.value);
            }
          }}
          placeholder="Ask me anything..."
        ></textarea>
        {disabled ? (
          <button
            about="submit query"
            type="button"
            onClick={() => {
              handleCloseEventSource();
            }}
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
