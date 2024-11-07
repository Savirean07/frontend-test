import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";

// icons
import { IoIosClose } from "react-icons/io";
import {
  MdAttachFile,
  MdOutlineDescription,
  MdOutlineTableChart,
  MdPerson,
} from "react-icons/md";

import { TextAnimation } from "src/components/animation";

// hooks
import { useMsal } from "src/auth";
import helperFunctions from "src/auth/helper";
import { IprogressStatus } from "src/utils";
import { IFileData, IFileManager } from "src/contexts/email-generator.context";
import useAlert from "src/hooks/alert";
import { LuLoader } from "react-icons/lu";
import FileViewWindow, {
  TFileData,
} from "../role-email-generator/components/file-view-window";
import { SideSection, TopBar } from "../role-email-generator/components";
import { Button, IconButton } from "src/components/ui";
import Markdown from "react-markdown";
import { URIs } from "src/config";

type Files = IFileManager["files"];
type StartCallbackError = {
  status: "error";
  message: string | Error;
};
type StartCallbackSuccess = {
  status: "running" | "stopped";
};
type RegisterCallback = {
  status: "registered";
  client_session_id: string;
  session_id: string;
};
type IEmiterCallback =
  | StartCallbackSuccess
  | StartCallbackError
  | RegisterCallback;

type ProgressStatus = {
  status: IprogressStatus;
  message?: string;
};

type TProfileAnalystResponse = {
  id: string;
  firstName?: string;
  lastName?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  summary?: string;
};

const ProfileAnalystRole = () => {
  const navigate = useNavigate();
  const { msalInstance } = useMsal();

  const [searchParams] = useSearchParams();
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
  const { getToken, getPolicy } = helperFunctions(msalInstance);
  const {
    alert: alerts,
    setAlert: setAlerts,
    setAlwaysActiveAlert,
  } = useAlert();

  const [progressStatus, setProgressStatus] = useState<ProgressStatus>({
    status: "initial",
  });

  const [files, setFiles] = useState<Files>([]);
  const [openViewWindow, setOpenViewWindow] = useState<TFileData | null>(null);

  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);

  // role response handler
  const [roleResponse, setRoleResponse] = useState<TProfileAnalystResponse[]>(
    []
  );

  const socket = useRef<Socket | null>(null);

  const createSocket = (token: string, policy: string) => {
    if (socket.current) {
      socket.current.disconnect();
      socket.current = null;
    }

    setAlerts({
      message: "Connecting to Lead Generator...",
      type: "info",
    });
    if (socket.current) return;

    setAlerts({ type: "info", message: "Connecting to server..." });

    const socketUrl = `${URIs.SOCKET_URL}/ws/role/profile-analyst`;
    console.log(URIs.SOCKET_PATH);
    const socketClient = io(socketUrl, {
      path: URIs.SOCKET_PATH,
      auth: {
        token,
        policy,
      },
      transports: ["websocket"],
    });
    socket.current = socketClient;

    socketClient.on("connect_error", (error: { message: string }) => {
      setProgressStatus({ status: "connection_error", message: error.message });
      setAlerts({ type: "error", message: error.message });
    });

    // socket connection
    socketClient.on("connect", () => {
      setIsSocketConnected(true);
      setProgressStatus({ status: "waiting", message: "Connected to server" });
      setAlerts({ type: "success", message: "Connected to server" });
      const clientSessionID = searchParams.get("clientSessionID");
      socketClient.emit(
        "register",
        { client_session_id: clientSessionID },
        (response: IEmiterCallback) => {
          if (response.status === "registered") {
            navigate({
              search: `?clientSessionID=${response.client_session_id}`,
            });
          } else if (response.status === "error") {
            setProgressStatus({
              status: "connection_error",
              message: response.message.toString(),
            });
            setAlerts({ type: "error", message: response.message.toString() });
          }
        }
      );
    });

    socketClient.on("error", (error: { message: string }) => {
      setAlerts({ type: "error", message: error.message });
    });

    socketClient.on("data", (data: TProfileAnalystResponse[]) => {
      setRoleResponse((prev) => {
        return [
          ...prev,
          ...data.filter(
            (item) => !prev.some((response) => response.id === item.id)
          ),
        ];
      });
    });

    socketClient.on("message", (message: string) => {
      setAlwaysActiveAlert({
        type: "info",
        message: message.match(/Processing (.*)$/)?.[1] || message,
      });
    });

    socketClient.on(
      "close",
      ({ code, signal }: { code: number; signal: NodeJS.Signals | null }) => {
        setProgressStatus({ status: "initial" });
        if (code === 0) {
          setAlerts({
            type: "success",
            message: "Environment successfully closed",
          });
          setRoleResponse((prev) => {
            return [
              ...prev,
              {
                id: window.crypto.randomUUID(),
                full_name: "Profile Analyst",
                summary: `Process has been completed, Please check \`json_cache.json\` file for detailed results`,
              },
            ];
          });
          return;
        } else if (signal) {
          setAlerts({
            type: "warning",
            message: "Process has been stopped with signal " + signal,
          });
        } else {
          setAlerts({
            type: "warning",
            message: `Process has been stopped with code ${code}`,
          });
        }
      }
    );

    socketClient.on("disconnect", () => {
      setIsSocketConnected(false);
      setProgressStatus({ status: "initial" });
      setAlerts({
        type: "warning",
        message: "Disconnected from server",
      });
    });
  };

  socket.current?.on("connect_error", (error) => {
    setAlerts({ type: "error", message: error.message });
  });

  const handleSubmitPromptRequest = () => {
    const clientSessionID = searchParams.get("clientSessionID");
    if (!clientSessionID) {
      return setAlerts({
        type: "error",
        message: "No client session ID found",
      });
    }
    if (!socket.current)
      return setAlerts({
        type: "error",
        message: "No socket connection found",
      });
    socket.current?.emit(
      "start_profile_analyst",
      { client_session_id: clientSessionID },
      (response: IEmiterCallback) => {
        if (response.status === "running") {
          setProgressStatus({ status: "in_progress" });
        } else if (response.status === "stopped") {
          setProgressStatus({ status: "initial" });
        } else if (response.status === "error") {
          setProgressStatus({ status: "initial" });
          setAlerts({ type: "error", message: response.message.toString() });
        } else {
          setAlerts({ type: "error", message: "Unknown response status" });
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
        setProgressStatus({ status: "initial" });
      }
    );
  };

  const handleCreateNewEnvironment = () => {
    if (socket.current?.connected) {
      socket.current.disconnect();
      setIsSocketConnected(false);
      socket.current = null;
    }
    searchParams.delete("clientSessionID");
    navigate({ search: `?${searchParams.toString()}` });
    setProgressStatus({ status: "in_progress_new_env" });
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
  };

  useEffect(() => {
    if (isFirstTime) {
      handleCreateNewEnvironment();
      console.log("first time");
    }
    setIsFirstTime(false);
    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-row justify-between">
      {/* sidebar */}
      <SideSection
        colorTheme={{
          bgColor: "bg-blue-500/20",
          textColor: "text-blue-500",
          iconColor: "text-blue-500",
        }}
        fileSectionProps={{
          onOpenFile: (file) => setOpenViewWindow(file as TFileData),
          onDataChange: (data) => setFiles(data as IFileData[]),
        }}
        title="Profile Analyst"
      >
        <div className="flex flex-col gap-4 fixed bottom-8 px-4">
          <Button
            className="bg-blue-500 border border-blue-500/30 mx-4"
            onClick={handleCreateNewEnvironment}
          >
            Create New Environment
          </Button>
        </div>
      </SideSection>
      {/* main content */}
      <div className="flex-1 flex flex-col bg-white/10 relative font-cascade ">
        <TopBar
          progressStatus={progressStatus.status}
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
        {roleResponse.length <= 0 ? (
          <>
            <div className="absolute bottom-0 left-0 w-full h-[calc(100%-56px)] my-auto bg-black/50 flex flex-col justify-center items-center gap-4 backdrop-blur-sm z-10">
              {progressStatus.status === "in_progress_new_env" ? (
                <>
                  <LuLoader className="animate-spin text-gray-500 text-lg" />
                  <p className="text-gray-500 text-lg text-center">
                    New Environment under development, Please wait...
                  </p>
                </>
              ) : progressStatus.status === "connection_error" ? (
                <>
                  <p className="bg-red-500/20 p-2 rounded-md text-red-500 text-sm border border-red-500/30">
                    {progressStatus.message || "Connection Error"}
                  </p>
                  <span className="text-gray-500 text-sm">
                    {"<-"} Please create new environment
                  </span>
                </>
              ) : progressStatus.status === "in_progress" ? (
                <p className="bg-blue-500/20 p-2 rounded-md text-blue-500 text-sm border border-blue-500/30">
                  Generating...
                </p>
              ) : progressStatus.status === "waiting" ? (
                <div className="p-4 flex flex-col justify-center items-center h-full gap-4 relative">
                  <TextAnimation
                    text={`Welcome ${
                      msalInstance?.getActiveAccount()?.name || "guest"
                    } to the Profile Analyst Tool`}
                    contentRenderer={({ text }) => (
                      <h1 className="text-2xl font-bold text-gray-500">
                        {text}
                      </h1>
                    )}
                  />

                  <Button
                    onClick={handleSubmitPromptRequest}
                    className="bg-blue-500 border border-blue-500/30"
                  >
                    <span>Start</span>
                  </Button>
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
                          <span className="px-1 text-gray-300">
                            {file.name}
                          </span>
                        </button>
                        <button
                          title="remove"
                          className="p-1 rounded-full hover:bg-white/10 w-0 group-hover:w-6 overflow-hidden ease-in-out duration-300"
                        >
                          <IoIosClose size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <>
                  <p className="bg-red-500/20 p-2 rounded-md text-red-500 text-sm border border-red-500/30">
                    Disconnected from server
                  </p>
                  <IconButton
                    text="Create New Environment"
                    color="green"
                    hideIcon
                    onClick={handleCreateNewEnvironment}
                  />
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-4 max-w-5xl mx-auto pb-4 max-h-[calc(100vh-56px)]">
            <ul className="flex flex-col gap-4 overflow-y-auto scrollbar-hidden">
              {roleResponse.map((value) => {
                return (
                  <li
                    key={value.id}
                    className="bg-black-800 p-2 rounded-md border border-gray-800 text-sm"
                  >
                    <div className="flex flex-col gap-2 bg-black/70 p-2 rounded-md border border-gray-800 text-sm">
                      <span className=" font-bold flex items-center gap-2">
                        <span className="bg-gray-800 p-1 rounded-full bg-opacity-20 text-gray-500 bg-white/10">
                          <MdPerson size={16} />
                        </span>
                        {value.full_name ||
                          value.firstName + " " + value.lastName}
                      </span>
                      {typeof value.email === "string" && (
                        <span className="text-gray-500">{value.email}</span>
                      )}
                      {typeof value.phone === "string" && (
                        <span className="text-gray-500">{value.phone}</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 p-2">
                      <Markdown
                        components={{
                          code: ({ node, ...props }) => (
                            <code
                              className="bg-gray-800 p-1 rounded-md"
                              {...props}
                            />
                          ),
                          pre: ({ node, ...props }) => (
                            <pre
                              className="bg-gray-800 p-1 rounded-md"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {value.summary || "No summary provided"}
                      </Markdown>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <FileViewWindow
          themeColor="blue"
          className="z-[1000]"
          fileObject={openViewWindow as TFileData}
          onClose={() => setOpenViewWindow(null)}
        />
      </div>
    </div>
  );
};

export default ProfileAnalystRole;
