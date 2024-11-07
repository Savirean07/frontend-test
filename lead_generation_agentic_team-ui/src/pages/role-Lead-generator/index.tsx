import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

// icons
import { IoIosClose } from "react-icons/io";
import {
  MdAttachFile,
  MdGeneratingTokens,
  MdOutlineDescription,
  MdOutlineTableChart,
} from "react-icons/md";

import { TextAnimation } from "src/components/animation";
import {
  FileViewWindow,
  SideSection,
  TopBar,
} from "../role-email-generator/components";
import { useMsal } from "src/auth";
import { Button, MarkdownToHTML } from "src/components/ui";
import helperFunctions from "src/auth/helper";
import { TbError404 } from "react-icons/tb";
import { Socket, io } from "socket.io-client";
import useAlert from "src/hooks/alert";
import { BiLoader } from "react-icons/bi";
import { IprogressStatus } from "src/utils";
import { URIs } from "src/config";

const RoleLeadGenerator = () => {
  const { msalInstance } = useMsal();
  const [searchQuery, setSearchQuery] = useSearchParams();
  const {
    alert: alerts,
    setAlert: setAlerts,
    setAlwaysActiveAlert,
  } = useAlert();

  const [progressStatus, setProgressStatus] = useState<IprogressStatus>("idle");
  const [isConnected, setIsConnected] = useState(false);

  const [files, setFiles] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);
  const [csvData, setCsvData] = useState<
    | {
        name: string;
        data?: string;
      }[]
    | null
  >([]);
  const [openViewWindow, setOpenViewWindow] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const urlScraperSocket = useRef<Socket | null>(null);

  const startScraper = async (token: string, policy: string) => {
    setAlerts({
      message: "Connecting to Lead Generator...",
      type: "info",
    });
    let clientId = searchQuery.get("client_session_id");
    if (!clientId) {
      clientId = window.crypto.randomUUID();
      setSearchQuery({
        ...searchQuery,
        client_session_id: clientId,
      });
    }
    if (urlScraperSocket.current) {
      return;
    }

    try {
      const socket = io(`${URIs.SOCKET_URL}/ws/role/url-scraper`, {
        transports: ["websocket"],
        path: URIs.SOCKET_PATH,
        auth: {
          token: token,
          policy: policy,
        },
      });
      urlScraperSocket.current = socket;

      socket.on("connect", () => {
        setIsConnected(true);
        setProgressStatus("waiting");
        setAlerts({
          message: "Lead Generator Connected",
          type: "success",
        });
        socket.emit(
          "subscribe",
          {
            clientSessionID: clientId,
          },
          (response: { code: 200 | number; message: string }) => {
            setAlerts({
              message: response.message,
              type: response.code === 200 ? "success" : "error",
            });
          }
        );
        socket.emit(
          "is_in_progress",
          {
            clientSessionID: clientId,
          },
          (status: boolean) => {
            setProgressStatus(status ? "in_progress" : "idle");
          }
        );
      });

      socket.on("success", (message) => {
        setAlerts({
          message: message,
          type: "success",
        });
        setProgressStatus("success");
      });

      socket.on("close", ({ code }: { code: number }) => {
        setProgressStatus("close");
        if (code === 0) {
          setAlwaysActiveAlert({
            message: "Lead Generator stopped",
            type: "info",
          });
        } else {
          setAlwaysActiveAlert({
            message: "Something went wrong, Lead Generator stopped",
            type: "error",
          });
        }
      });

      socket.on(
        "file_changed",
        async (data: {
          fileData: string;
          sessionId: string;
          message: string;
        }) => {
          setCsvData((prev) => {
            if (prev) {
              return [
                ...prev,
                {
                  name: data.message,
                  data: data.fileData,
                },
              ];
            }
            return [{ name: data.message, data: data.fileData }];
          });
        }
      );

      socket.on("disconnect", () => {
        setAlerts({
          message: "Scraper disconnected",
          type: "error",
        });
        setIsConnected(false);
      });

      socket.on("connect_error", (error) => {
        setAlerts({
          message: `Failed to connect to the scraper: ${error.message}`,
          type: "error",
        });
        setProgressStatus("error");
      });
    } catch (error: any) {
      setAlerts({
        message: `Failed to start the scraper: ${error.message}`,
        type: "error",
      });
    }
  };

  const prompt = () => {
    const { current: socket } = urlScraperSocket;
    if (!isConnected) {
      setAlerts({
        message: "Scraper is not connected",
        type: "error",
      });
      return;
    }
    if (socket) {
      socket.emit(
        "prompt",
        { clientSessionID: searchQuery.get("client_session_id") },
        (response: { code: 200 | number; message: string }) => {
          setAlerts({
            message: response.message,
            type: response.code === 200 ? "success" : "error",
          });
          setProgressStatus("in_progress");
        }
      );
    }
  };

  const abort = async (clientSessionID?: string | null) => {
    const { current: socket } = urlScraperSocket;
    const ID =
      typeof clientSessionID === "string"
        ? clientSessionID
        : searchQuery.get("client_session_id");
    if (socket) {
      socket.emit("abort", {
        clientSessionID: ID,
      });
    }
  };

  useEffect(() => {
    setCsvData([]);
    setProgressStatus("in_progress_new_env");
    urlScraperSocket.current?.disconnect();
    setIsConnected(false);
    urlScraperSocket.current = null;
    const { getPolicy, getToken } = helperFunctions(msalInstance);
    try {
      const localPolicy = getPolicy();
      if (!localPolicy) {
        setAlerts({
          message: "No policy found",
          type: "error",
        });
        return;
      }
      getToken().then((token) => {
        if (!token) {
          setAlerts({
            message: "No token found",
            type: "error",
          });
          return;
        }
        startScraper(token, localPolicy);
      });
    } catch (error: any) {
      setAlerts({
        message: `Failed to start the scraper: ${error.message}`,
        type: "error",
      });
    }
    return () => {
      if (urlScraperSocket.current?.connected) {
        urlScraperSocket.current.disconnect();
        setIsConnected(false);
        urlScraperSocket.current = null;
      }
    };
  }, [searchQuery.get("client_session_id")]);

  useEffect(() => {
    if (progressStatus === "in_progress") {
      setAlwaysActiveAlert({
        message: "Generating leads...",
        type: "info",
      });
    } else if (progressStatus === "waiting") {
      setAlwaysActiveAlert({
        message: "Waiting for action...",
        type: "info",
      });
    } else if (progressStatus === "close") {
      setAlwaysActiveAlert({
        message: "No process running",
        type: "info",
      });
    }
  }, [progressStatus]);

  return (
    <div className="min-h-screen flex flex-row justify-between">
      {/* sidebar */}
      <SideSection
        title="Lead Generator"
        icon={<MdGeneratingTokens />}
        colorTheme={{
          bgColor: "bg-violet-500/20",
          textColor: "text-violet-500",
          iconColor: "text-white",
        }}
        fileSectionProps={{
          onDataChange: (data) => {
            setFiles(data as any);
          },
          onOpenFile: (file) => {
            setOpenViewWindow(file as any);
          },
        }}
      >
        {searchQuery.get("client_session_id") ? (
          <div className="flex flex-col gap-2 mt-4 font-cascade px-4 items-center justify-center fixed bottom-4 h-fit">
            <Button
              className="bg-blue-500 text-white"
              onClick={() => {
                abort(searchQuery.get("client_session_id"));
                setSearchQuery((prev) => {
                  prev.delete("client_session_id");
                  return prev;
                });
              }}
            >
              Create New Environment
            </Button>
          </div>
        ) : null}
      </SideSection>
      {/* main content */}
      <div className="flex-1 flex flex-col bg-white/10 relative font-cascade ">
        <TopBar
          progressStatus={progressStatus}
          onStop={abort}
          isConnected={isConnected}
          message={alerts?.message}
          type={alerts?.type || "default"}
          handleDisconnect={() => {
            urlScraperSocket.current?.disconnect();
            setAlerts({
              message: "Lead Generator disconnected",
              type: "error",
            });
          }}
          handleConnect={() => {
            urlScraperSocket.current?.connect();
            setAlerts({
              message: "Lead Generator connecting...",
              type: "info",
            });
          }}
        />
        {csvData && csvData?.length <= 0 ? (
          <div className="p-4 flex flex-col justify-center items-center flex-1 gap-4 relative">
            <TextAnimation
              text={
                progressStatus !== "in_progress"
                  ? `Welcome ${
                      msalInstance?.getActiveAccount()?.name || "guest"
                    } to Lead Generator`
                  : `Generating leads...`
              }
              contentRenderer={({ text }) => (
                <h1 className="text-2xl font-bold text-gray-500">{text}</h1>
              )}
            />

            {progressStatus !== "in_progress" && (
              <>
                <Button
                  disabled={!isConnected}
                  className="bg-blue-500 text-white"
                  onClick={() => {
                    prompt();
                  }}
                >
                  Start
                </Button>
                <span className="text-gray-500/80 text-sm max-w-[400px] text-center border-y border-gray-500/20 pb-2">
                  {`You can start the tool by clicking the button above. It will bring the data in a CSV file.`}
                </span>
                <ul className="w-full flex flex-wrap justify-center items-center gap-4">
                  {files.length <= 0 ? (
                    <li className="flex items-center bg-red-500/10 p-1 rounded-full border border-red-500/50">
                      <span className="bg-red-500/20 p-1 rounded-full">
                        <TbError404 size={16} />
                      </span>
                      <span className="text-red-500 text-sm px-1">
                        No attachments found
                      </span>
                    </li>
                  ) : (
                    <li className="text-gray-500 flex items-center gap-2">
                      <span className="bg-gray-800 p-1 rounded-full">
                        <MdAttachFile size={16} />
                      </span>
                      <span>Attachments:</span>
                    </li>
                  )}
                  {files.map((file) => (
                    <li
                      key={file.id}
                      className="bg-black-800 p-1 rounded-full border hover:border-green-500/30 border-gray-800 text-sm text-white/80 flex items-center group ease-in-out duration-300"
                    >
                      <button
                        onClick={() => setOpenViewWindow(file)}
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
                </ul>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col justify-start items-center h-full gap-4 p-16 max-h-[calc(100vh-56px)] overflow-y-auto max-w-7xl scrollbar-hidden mx-auto w-full">
            {csvData?.map((csvData) => {
              if (!csvData.data) {
                return (
                  <p className="text-white/80 mb-1 bg-black text-center p-1 rounded-md w-full">
                    {csvData?.name}
                  </p>
                );
              }
              return (
                <div className="rounded-xl bg-gray-500/20 p-1 w-full text-sm">
                  <p className="text-white/80 mb-1 bg-black text-center p-2 rounded-md">
                    {csvData?.name}
                  </p>
                  {csvData?.data && (
                    <MarkdownToHTML
                      key={csvData.data}
                      animationProps={{
                        text: csvData.data,
                        animate: false,
                        pace: 100,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
        {!isConnected && csvData && csvData?.length <= 0 && (
          <div className="absolute bottom-0 left-0 w-full h-[calc(100%-56px)] bg-black/50 backdrop-blur-sm flex items-center justify-center z-[20]">
            {progressStatus === "in_progress_new_env" ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-2 flex-col">
                  <BiLoader size={32} className="animate-spin" />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <h1 className="text-2xl font-bold text-white">
                      Please wait while we creating a new scraper environment...
                    </h1>
                    <p className="text-white/80 bg-gray-800/50 p-1 rounded-md text-sm">
                      clientId: {searchQuery.get("client_session_id")}
                    </p>
                  </div>
                </div>
              </div>
            ) : progressStatus === "error" ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <h1 className="text-2xl font-bold text-white">
                  Some error occurred while connecting to the Lead Generator
                </h1>
                <p className="text-white/80 bg-gray-800/50 p-1 rounded-md text-sm">
                  Some error occurred while connecting to the Lead Generator,
                  please try again
                </p>
                <Button
                  className="bg-blue-500 text-white"
                  onClick={() => {
                    urlScraperSocket.current?.connect();
                    setAlerts({
                      message: "Trying to reconnect to the scraper...",
                      type: "info",
                    });
                    setProgressStatus("idle");
                  }}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <p className="bg-red-500/20 p-2 rounded-md text-red-500 text-sm border border-red-500/30">
                Server disconnected
              </p>
            )}
          </div>
        )}
        {openViewWindow && (
          <FileViewWindow
            fileObject={openViewWindow}
            onClose={() => setOpenViewWindow(null)}
          />
        )}
      </div>
    </div>
  );
};

export default RoleLeadGenerator;
