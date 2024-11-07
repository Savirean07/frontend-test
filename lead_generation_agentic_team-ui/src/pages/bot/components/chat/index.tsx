import { useEffect, useState } from "react";
import socket from "src/soket.io";

const ChatView = ({
  setResponse,
  handleShowHumanResponseWindow,
}: {
  setResponse: (response: unknown) => void;
  handleShowHumanResponseWindow: () => void;
}) => {
  const [AIResponse, setAIResponse] = useState<
    {
      id: string;
      prompt: string;
      response: {
        agent: string;
        report_to: string;
        status: string;
        content: string;
        options: {
          [key: string]: {
            content: { text: string; to: string }[];
            round: number;
            status: string;
          };
        };
      };
      timestamp: string;
      hasError: boolean;
    }[]
  >([
    {
      id: "1",
      prompt: "Hello",
      response: {
        agent: "Editor",
        report_to: "Organizer",
        status: "in_progress",
        content: "",
        options: {},
      },
      timestamp: new Date().toISOString(),
      hasError: false,
    },
  ]);

  useEffect(() => {
    // handleShowHumanResponseWindow();
    const options: {
      [key: string]: {
        content: { text: string; to: string }[];
        round: number;
        status: string;
      };
    } = {};
    socket.on(
      "bot_conversation",
      (
        data: {
          agent: string;
          report_to: string;
          status: string;
          content: string;
          response_type: string;
        },
        prompt: string
      ) => {
        if (data?.response_type === "human") {
          handleShowHumanResponseWindow();
          setResponse(options);
        }
        if (data.agent) {
          const optionData = options[data.agent];
          options[data.agent] = optionData
            ? {
                ...optionData,
                content: [
                  ...optionData.content,
                  { text: data.content, to: data.report_to },
                ],
                round: optionData.round + 1,
                status: data.status,
              }
            : {
                content: [{ text: data.content, to: data.report_to }],
                round: 1,
                status: data.status,
              };
        }
        const id = socket.id as string;
        const finalData = {
          id,
          prompt,
          timestamp: new Date().toISOString(),
          response: {
            agent: data.agent,
            report_to: data.report_to,
            status: data.status,
            content: data.content,
            options,
          },
          hasError: false,
        };
        setAIResponse((prev) => {
          const oldData = prev.find((item) => item.id === id);
          if (oldData) {
            return prev.map((item) => (item.id === id ? finalData : item));
          }
          return [...prev, finalData];
        });
      }
    );
  }, []);

  if (AIResponse.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center self-stretch grow">
        <div className="lg:text-9xl text-5xl font-extrabold text-black-800 flex flex-col items-center uppercase">
          <span>Welcome</span>
          <span>To</span>
          <span>Wingman</span>
        </div>
      </div>
    );
  }
  return AIResponse.map((response, index) => {
    return (
      <div
        key={"chat" + index}
        aria-busy={response.hasError}
        className="border max-w-7xl mx-auto w-full sm:p-4 rounded-3xl aria-busy:border-red-500 aria-busy:bg-red-900/10 border-transparent"
      >
        test
      </div>
    );
  });
};

export default ChatView;
