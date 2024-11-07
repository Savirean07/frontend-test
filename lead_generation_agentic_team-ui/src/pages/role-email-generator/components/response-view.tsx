import { useContext, useEffect, useRef } from "react";
import { BsRobot } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import { EmailGeneratorContext } from "src/contexts";
import TextResponseView from "src/pages/bot/components/response.section";
import { twMerge } from "tailwind-merge";

const ResponseView = () => {
  const {
    bot: { response: roleResponse },
    adminPromptResponse: { submitAdminPromptResponse },
  } = useContext(EmailGeneratorContext);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollHeight = scrollRef.current?.scrollHeight;
    if (!scrollHeight) return;
    scrollRef.current?.scrollTo({
      top: scrollHeight,
      behavior: "smooth",
    });
  }, [roleResponse.length]);

  return (
    <>
      <div className="w-full max-h-[calc(100vh-56px)] overflow-auto scrollbar-hidden">
        <div
          ref={scrollRef}
          className="flex flex-col justify-top items-center w-full max-w-7xl overflow-auto p-8 mx-auto scrollbar-hidden"
        >
          {roleResponse.map((response, index) => {
            if (!response.content) return null;
            return (
              <TextResponseView
                key={index}
                response={response}
                submitAdminPromptResponse={submitAdminPromptResponse}
                allResponses={roleResponse}
              />
            );
          })}
          {roleResponse.at(-1)?.status === "in_progress" ? (
            <div className="flex justify-center items-center w-full h-full bg-gray-800/50 rounded-xl p-8 self-start text-white max-w-7xl mx-auto border-2 border-gray-800 flex-col">
              <p className="text-2xl font-bold">
                Generating
                {[1, 2, 3].map((num) => (
                  <span
                    style={{ animationDelay: `${num * 330}ms` }}
                    className="animate-pulse-progress"
                    key={num}
                  >
                    .
                  </span>
                ))}
              </p>
              <p className="text-sm">
                This may take a while, please wait for the email to be generated
                before submitting.
              </p>
              <p className="text-sm bg-green-700/20 rounded-xl p-2 w-fit mt-4 flex items-center gap-2">
                <span className="items-center text-xl bg-green-800/50 rounded-xl p-2">
                  <BsRobot />
                </span>
                {roleResponse.at(-1)?.agent} working... for{" "}
                {roleResponse.at(-1)?.report_to}
              </p>
            </div>
          ) : roleResponse.at(-1)?.status === "aborted" ? (
            <div className="flex flex-row justify-center items-center gap-2 relative self-stretch max-w-6xl">
              <div className="flex flex-col justify-center items-center gap-2 relative self-stretch">
                <span
                  className={twMerge(
                    "text-xl rounded-full p-2 bg-black/50 relative"
                  )}
                >
                  <MdOutlineCancel />

                  <span
                    className={twMerge(
                      "absolute top-1/2 -right-2 -translate-y-1/2 w-2 h-1"
                    )}
                  ></span>
                </span>
                <div className={twMerge("w-1 h-full -mt-2")}></div>
              </div>
              <div className="flex justify-start items-start w-full h-full bg-gray-800/50 rounded-xl p-8 self-start text-white border-2 border-gray-800 flex-col">
                <p className="text-2xl font-bold">Aborted</p>
                <p className="text-sm">
                  The mail composition process is aborted.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ResponseView;
