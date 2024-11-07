import { useState } from "react";
import { BiSend } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import socket from "src/soket.io";

const HumanResponseWindow = ({
  onClose,
  AIResponse,
}: {
  onClose: () => void;
  AIResponse: { [key: string]: unknown };
}) => {
  console.log("AIResponses: ", AIResponse);
  const [inputHeight, setInputHeight] = useState<number>(26);
  const [inputValue, setInputValue] = useState<string>("");
  const updateInputHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const scrollHeight = e.target.scrollHeight;
    if (scrollHeight > 90) return;
    setInputHeight(scrollHeight);
  };

  const checkLinesAndUpdateHeight = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputContainer = document.getElementById(
      "human-response-input"
    ) as HTMLDivElement;
    if (inputContainer) {
      inputContainer.classList.add("outline");
    }
    const lines = e.target.value.split("\n").length;
    const lineHeight = lines * 16 + (e.target.scrollHeight - 16);
    if (lineHeight > 90) {
      setInputHeight(90);
    } else {
      setInputHeight(lineHeight);
    }
  };

  const resetInputHeight = () => {
    const inputContainer = document.getElementById(
      "human-response-input"
    ) as HTMLDivElement;
    if (inputContainer) {
      inputContainer.classList.remove("outline");
    }
    setInputHeight(26);
  };

  const handleClose = () => {
    onClose();
    handleSendResponse(null);
  };

  const handleSendResponse = async (data: string | null = "") => {
    onClose();
    try {
      // const response = await fetch(
      //   `http://localhost:5500/role/emit/user-input`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ role: "user", content: data }),
      //   }
      // );
      // const dataJson = await response.json();
      // console.log("data: ", dataJson);
      socket.emit(
        "user_conversation",
        window.sessionStorage.getItem("session_id"),
        data
      );
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <div className="w-screen h-screen bg-black-900/40 absolute top-0 left-0 backdrop-blur-sm flex justify-center items-center">
      <div className="w-full lg:w-10/12 xl:w-3/4 2xl:w-1/2 sm:aspect-video max-h-[90vh] border border-black-600 rounded-lg bg-black-800 relative animate-slide-up">
        <button
          title="Exit"
          className="absolute top-2 right-2"
          onClick={handleClose}
        >
          <CgClose className="fill-white" />
        </button>
        <h1 className="border-b border-black-600 text-center py-2 text-lg font-cascade ">
          Human Response
        </h1>
        <div className="p-4 flex flex-col h-full">
          <p className="p-2 rounded bg-[#222222] grow overflow-auto scrollbar-hidden text-xs sm:text-sm lg:text-base">
            {JSON.stringify(AIResponse?.["User_proxy"])}
          </p>

          <p className="font-cascade mt-2 text-xs sm:text-sm lg:text-base">
            Please give feedback to writing_assistant. Press close button to
            stop the conversation or type your response and press send button
          </p>
          <div
            id="human-response-input"
            className="mt-4 px-2 py-2 flex bg-black-900 rounded-2xl gap-2 outline-green-500/30 shadow-lg shadow-black-900/30"
          >
            <textarea
              className="outline-none w-full bg-transparent scrollbar-hidden text-xs sm:text-sm lg:text-base"
              rows={1}
              style={{ height: `${inputHeight}px` }}
              name=""
              value={inputValue}
              id=""
              onChange={updateInputHeight}
              onFocus={checkLinesAndUpdateHeight}
              onBlur={resetInputHeight}
            ></textarea>
            <button
              className=" self-end"
              onClick={() => handleSendResponse(inputValue)}
            >
              <BiSend className=" fill-violet-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HumanResponseWindow;
