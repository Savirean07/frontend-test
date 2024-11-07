import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";

// icons
import { IoIosClose } from "react-icons/io";
import {
  MdAdd,
  MdAttachFile,
  MdOutlineAdd,
  MdOutlineDescription,
  MdOutlineTableChart,
} from "react-icons/md";

// components
import {
  FileViewWindow,
  ResponseView,
  SideSection,
  TopBar,
} from "./components";
import AddNewFile from "./components/addFile";
import PromptInput from "src/components/ui/prompt.input";
import { TextAnimation } from "src/components/animation";

// contexts
import {
  EmailGeneratorContext,
  EmailHistory,
  type IFileManager,
  type ResponseData,
} from "src/contexts";

// hooks
import { useMsal } from "src/auth";
import helperFunctions from "src/auth/helper";
import { IprogressStatus } from "src/utils";
import {
  IFileData,
  useEmailGeneratorContext,
} from "src/contexts/email-generator.context";
import useAlert from "src/hooks/alert";
import { Button, IconButton } from "src/components/ui";
import { BsDatabaseFillX } from "react-icons/bs";
import { LuLoader } from "react-icons/lu";
import { TFileData } from "./components/file-view-window";
import { URIs } from "src/config";

type Files = IFileManager["files"];
type BotResponse = ResponseData[];

const EmailGeneratorRole = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { msalInstance } = useMsal();
  const { getToken, getPolicy } = helperFunctions(msalInstance);
  const { generatedEmailHistory } = useEmailGeneratorContext();
  const { alert: alerts, setAlert: setAlerts } = useAlert();

  const [_, setRequestStatus] = useState<IprogressStatus>("idle");
  const [progressStatus, setProgressStatus] =
    useState<IprogressStatus>("initial");

  const [files, setFiles] = useState<Files>([]);
  const [openViewWindow, setOpenViewWindow] = useState<TFileData | null>(null);
  const [openAddFileWindow, setOpenAddFileWindow] = useState<boolean>(false);

  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);

  // role response handler
  const [roleResponse, setRoleResponse] = useState<BotResponse>([]);
  const [prompt, setPrompt] = useState<string>("");

  const [emailHistory, setEmailHistory] = useState<EmailHistory[]>([]);
  const socket = useRef<Socket | null>(null);

  const createSocket = (token: string, policy: string) => {
    setAlerts({
      message: "Connecting to Lead Generator...",
      type: "info",
    });
    let clientId = searchParams.get("clientSessionID");
    if (!clientId) {
      clientId = window.crypto.randomUUID();
      setSearchParams({
        ...searchParams,
        clientSessionID: clientId,
      });
    }
    if (socket.current) return;

    setAlerts({ type: "info", message: "Connecting to server..." });
    const socketClient = io(`${URIs.SOCKET_URL}`, {
      path: URIs.SOCKET_PATH,
      auth: {
        token,
        policy,
      },
      transports: ["websocket"],
    });
    socket.current = socketClient;

    socketClient.on("connect_error", (error: { message: string }) => {
      setProgressStatus("connection_error");
      setAlerts({ type: "error", message: error.message });
    });

    // socket connection
    socketClient.on("connect", () => {
      setIsSocketConnected(true);
      setProgressStatus("waiting");
      setAlerts({ type: "success", message: "Connected to server" });
      socketClient.emit(
        "register",
        { clientSessionID: searchParams.get("clientSessionID") },
        (response: { clientSessionID: string; message: string }) => {
          navigate({ search: `?clientSessionID=${response.clientSessionID}` });
          setAlerts({
            type: "info",
            message:
              "successfully subscribed"
          });
          generatedEmailHistory.set({
            id: response.clientSessionID,
            created_at: Date.now(),
          });
          socketClient.emit(
            "pull_data",
            { clientSessionID: response.clientSessionID },
            (response: { data?: BotResponse; message?: string }) => {
              if (response.message) {
                setAlerts({ type: "info", message: response.message });
              }
              if (Array.isArray(response.data)) {
                if (response.data.length <= 0) {
                  setAlerts({
                    type: "info",
                    message: "No data found for this client session ID",
                  });
                }
                setRoleResponse(response.data);
                generatedEmailHistory.update(
                  searchParams.get("clientSessionID") as string,
                  {
                    timeline: response.data,
                  }
                );
              }
            }
          );
        }
      );
    });

    // socket events
    socketClient.on("stream", (response: ResponseData) => {
      if (response.status) {
        setProgressStatus(response.status as IprogressStatus);
      }
      setAlerts({
        type: "info",
        message: "Responded by " + response.agent + ": " + response.report_to,
      });
      setRoleResponse((prev) => [...prev, response]);
      generatedEmailHistory.update(
        searchParams.get("clientSessionID") as string,
        {
          timeline: [...roleResponse, response],
        }
      );
    });

    // socketClient.on("error", (error: { message: string }) => {
    //   setAlerts({ type: "error", message: error.message });
    // });

    socketClient.on(
      "close",
      ({
        message,
        code,
      }: {
        message: string;
        code: number | NodeJS.Signals;
      }) => {
        if (!message.includes("SIGABRT") || code !== "SIGABRT") {
          setAlerts({ type: "warning", message: message });
        }

        setRoleResponse((prev) => {
          if (prev.length > 0) {
            return prev.map((item, index, array) => {
              if (index === array.length - 1) {
                return {
                  ...item,
                  status: code === "SIGABRT" ? "aborted" : "closed",
                };
              }
              return item;
            });
          }
          return prev;
        });
      }
    );
  };
  socket.current?.on("disconnect", () => {
    setIsSocketConnected(false);
  });

  const handleSubmitPromptRequest = () => {
    const clientSessionID = searchParams.get("clientSessionID");
    if (!clientSessionID) {
      return setAlerts({
        type: "error",
        message: "No client session ID found",
      });
    }
    socket.current?.emit(
      "inti_prompt",
      { prompt, clientSessionID },
      (response: { code: number; message: string }) => {
        if (response.code === 200) {
          setRequestStatus("in_progress");
          setProgressStatus("in_progress");
        } else {
          setRequestStatus("error");
          setProgressStatus("error");
        }
      }
    );
  };

  const submitAdminPromptResponse = (id: string | number, prompt: string) => {
    const clientSessionID = searchParams.get("clientSessionID");
    if (!clientSessionID) {
      return setAlerts({
        type: "error",
        message: "No client session ID found",
      });
    }
    socket.current?.emit(
      "admin_prompt_response",
      {
        prompt,
        clientSessionID,
        promptId: id,
      },
      (response: { code: number; message: string }) => {
        if (response.code === 200) {
          setRoleResponse((prev) =>
            prev.filter((response) => response.id !== id)
          );
        } else {
          setAlerts({ type: "error", message: response.message });
        }
      }
    );
  };

  const handleEndRoleResponse = (id?: string | number) => {
    const clientSessionID =
      typeof id === "string" ? id : searchParams.get("clientSessionID");
    socket.current?.emit(
      "stop_role_mail_composer",
      { clientSessionID },
      (response: { clientSessionID: string; message: string }) => {
        setAlerts({ type: "info", message: response.message });
        setProgressStatus("initial");
      }
    );
  };

  const handleSendEmail = (emailData: {
    subject: string;
    body: string;
    to: string;
    from?: string;
    cc?: string;
    bcc?: string;
  }) => {
    const clientSessionID = searchParams.get("clientSessionID");
    if (!clientSessionID) {
      return setAlerts({
        type: "error",
        message: "No client session ID found",
      });
    }
    setAlerts({
      type: "info",
      message: "Sending email..." + JSON.stringify(emailData),
    });
    socket.current?.emit(
      "send_email_through_outlook",
      { emailData, clientSessionID },
      (response: { code: number; message: string }) => {
        if (response.code === 200) {
          setAlerts({ type: "success", message: response.message });
        } else {
          setAlerts({ type: "error", message: response.message });
        }
      }
    );
  };

  useEffect(() => {
    setProgressStatus("initial");
    setRoleResponse([]);
    getToken()
      .then((token) => {
        if (!token) {
          return navigate("/login");
        }
        createSocket(token, getPolicy() || "");
      })
      .catch((error) => {
        if (error.status !== 401) {
          msalInstance?.logoutPopup();
        }
        navigate("/login");
      });
    return () => {
      socket.current?.disconnect();
      socket.current = null;
    };
  }, [searchParams.get("clientSessionID")]);

  return (
    <EmailGeneratorContext.Provider
      value={{
        fileManager: {
          files,
          setFiles,
          handleCloseViewWindow: () => setOpenViewWindow(null),
          setOpenAddFileWindow,
          handleCloseAddFileWindow: () => setOpenAddFileWindow(false),
          openAddFileWindow,
        },
        bot: {
          response: roleResponse,
          setResponse: setRoleResponse,
          prompt,
          setPrompt,
          handleStartRoleResponse: handleSubmitPromptRequest,
          handleEndRoleResponse: handleEndRoleResponse,
          handleResponedRoleResponse: submitAdminPromptResponse,
          loadingStatus: "initial",
          setLoadingStatus: () => {},
        },
        promptRequest: { submitPromptRequest: handleSubmitPromptRequest },
        adminPromptResponse: {
          submitAdminPromptResponse: submitAdminPromptResponse,
        },
        emailHistory: {
          history: emailHistory,
          setHistory: setEmailHistory,
        },
        socketConnection: {
          isConnected: isSocketConnected,
        },
        handleSendEmail: {
          handleSendEmail: handleSendEmail,
        },
      }}
    >
      <div className="min-h-screen flex flex-row justify-between">
        {/* sidebar */}
        <SideSection
          fileSectionProps={{
            onOpenFile: (file) => setOpenViewWindow(file as TFileData),
            onDataChange: (data) => setFiles(data as IFileData[]),
          }}
          title="Mail Composer"
        >
          <div className="flex flex-col gap-1 grow p-4 mt-4 border-t border-gray-800">
            <p className="text-sm w-full flex flex-row items-center uppercase">
              <span className="grow">Previous Cold Emails</span>

              <IconButton
                hidden={emailHistory.length <= 0}
                icon={<MdAdd />}
                text="Generate"
              />
            </p>
            {emailHistory.length <= 0 ? (
              <div className="h-64 text-center flex flex-col items-center justify-center">
                <span className="text-gray-500">
                  <BsDatabaseFillX size={24} />
                </span>
                <p className="text-gray-500 text-sm">
                  <TextAnimation text="No Previous Emails" />
                </p>
                <div className="flex flex-col gap-2 mt-4 font-cascade px-4 items-center justify-center fixed bottom-4 h-fit">
                  <Button
                    className="bg-blue-500 text-white"
                    onClick={() => {
                      handleEndRoleResponse(
                        searchParams.get("clientSessionID") as string
                      );
                      setSearchParams((prev) => {
                        prev.delete("clientSessionID");
                        return prev;
                      });
                    }}
                  >
                    Create New Environment
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {emailHistory.map((item, index) => (
                  <div key={index}>
                    <p>{item.subject}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SideSection>
        {/* main content */}
        <div className="flex-1 flex flex-col bg-white/10 relative font-cascade ">
          <TopBar
            progressStatus={progressStatus}
            onStop={handleEndRoleResponse}
            isConnected={isSocketConnected}
            message={alerts?.message}
            type={alerts?.type || "default"}
            handleDisconnect={() => {
              setAlerts({
                type: "warning",
                message: "Disconnecting from server...",
              });
              socket.current?.disconnect();
            }}
            handleConnect={() => {
              setAlerts({
                type: "info",
                message: "Connecting to server...",
              });
              socket.current?.connect();
            }}
          />
          {roleResponse.length <= 0 && !isSocketConnected ? (
            <>
              <div className="absolute bottom-0 left-0 w-full h-[calc(100%-56px)] my-auto bg-black/50 flex flex-col justify-center items-center gap-4 backdrop-blur-sm z-50">
                {progressStatus === "initial" ? (
                  <>
                    <LuLoader className="animate-spin text-gray-500 text-lg" />
                    <p className="text-gray-500 text-lg text-center">
                      New Environment under development, Please wait...
                    </p>
                    <span className="bg-black/50 p-2 rounded-md">
                      Client Session ID: {searchParams.get("clientSessionID")}
                    </span>
                  </>
                ) : progressStatus === "connection_error" ? (
                  <>
                    <p className="bg-red-500/20 p-2 rounded-md text-red-500 text-sm border border-red-500/30">
                      Connection Error
                    </p>
                    <span className="text-gray-500 text-sm">
                      {"<-"} Please create new environment
                    </span>
                  </>
                ) : progressStatus === "in_progress" ? (
                  <p className="bg-green-500/20 p-2 rounded-md text-green-500 text-sm border border-green-500/30">
                    Generating...
                  </p>
                ) : null}
              </div>
            </>
          ) : progressStatus === "waiting" && roleResponse.length <= 0 ? (
            <div className="p-4 flex flex-col justify-center items-center h-full gap-4 relative">
              <TextAnimation
                text={`Welcome ${
                  msalInstance?.getActiveAccount()?.name || "guest"
                } to the Mail Composer Tool`}
                contentRenderer={({ text }) => (
                  <h1 className="text-2xl font-bold text-gray-500">{text}</h1>
                )}
              />

              <PromptInput
                inputPrompt={prompt}
                onClose={handleEndRoleResponse}
                onSubmit={handleSubmitPromptRequest}
              />
              <ul className="w-full flex flex-wrap justify-center items-center gap-4 max-w-5xl">
                <li className="text-gray-500 flex items-center gap-2">
                  <span className="bg-gray-800 p-1 rounded-full">
                    <MdAttachFile size={16} />
                  </span>
                  <span>Attachments:</span>
                </li>
                {files.map((file) => (
                  <li
                    key={file.id}
                    className="bg-black-800 p-1 rounded-full border hover:border-green-500/30 border-gray-800 text-sm text-white/80 flex items-center group ease-in-out duration-300"
                  >
                    <button
                      onClick={() => setOpenViewWindow(file as TFileData)}
                      className="flex items-center gap-2"
                    >
                      <span className="group-hover:bg-green-500/30 bg-gray-800 p-1 rounded-full">
                        {file.name?.endsWith(".csv") ? (
                          <MdOutlineTableChart size={16} />
                        ) : (
                          <MdOutlineDescription size={16} />
                        )}
                      </span>
                      <span className="px-1 text-gray-300">{file.name}</span>
                    </button>
                    <button
                      title="remove"
                      className="p-1 rounded-full hover:bg-white/10 w-0 group-hover:w-6 overflow-hidden ease-in-out duration-300"
                    >
                      <IoIosClose size={16} />
                    </button>
                  </li>
                ))}
                <button
                  onClick={() => setOpenAddFileWindow(true)}
                  className="bg-black-800 p-1 rounded-full border hover:border-green-500/30 border-gray-800 text-sm text-white/80 flex items-center group ease-in-out duration-300"
                >
                  <span className="group-hover:bg-green-500/30 bg-gray-800 p-1 rounded-full">
                    <MdOutlineAdd size={16} />
                  </span>
                  <span className="px-1 text-gray-300">Add File</span>
                </button>
              </ul>
            </div>
          ) : null}
          <ResponseView />
          <FileViewWindow
            fileObject={openViewWindow as TFileData}
            onClose={() => setOpenViewWindow(null)}
          />
          <AddNewFile />
        </div>
      </div>
    </EmailGeneratorContext.Provider>
  );
};

export default EmailGeneratorRole;
