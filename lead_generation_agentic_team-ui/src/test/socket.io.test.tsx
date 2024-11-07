import { Socket } from "node_modules/socket.io-client/build/esm";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useMsal } from "src/auth";
import helper from "src/auth/helper";

const TestSocketIo = () => {
  const { msalInstance } = useMsal();
  const socketIO = useRef<Socket | null>(null);
  const [socketId, setSocketId] = useState<string | undefined>("");
  const [message, setMessage] = useState<string>("");
  const [stream, setStream] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");

  const handleChangeUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSend = () => {
    if (!socketIO.current) return;
    const clientSessionID = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("clientSessionID="))
      ?.split("=")[1];
    console.log("clientSessionID", clientSessionID);
    if (!clientSessionID) return;
    socketIO.current.emit(
      "inti_prompt",
      { clientSessionID },
      (response: { clientSessionID: string; message: string }) => {
        console.log("register response", response);
      }
    );
  };

  const handleSubmitUserInput = () => {
    if (!socketIO.current) return;
    const clientSessionID = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("clientSessionID="))
      ?.split("=")[1];
    console.log("clientSessionID", clientSessionID);
    if (!clientSessionID) return;
    socketIO.current.emit("admin_prompt_response", {
      prompt: userInput,
      clientSessionID
    });
  };

  const handleSocket = async (token: string, policy: string) => {
    const socket = io("https://apiai.whiteblob.site", {
      autoConnect: true,
      auth: {
        token,
        policy,
      },
    });

    socket.on("connect", () => {
      console.log("connected to socket");
      setSocketId(socket.id);
      socketIO.current = socket;
      const clientSessionID = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("clientSessionID="))
        ?.split("=")[1];
      console.log("clientSessionID", clientSessionID);
      socket.emit(
        "register",
        {
          clientSessionID,
        },
        (response: { clientSessionID: string; message: string }) => {
          console.log("register response", response);
          // save in session Cookie
          document.cookie = `clientSessionID=${response.clientSessionID}; path=/`;
        }
      );
    });

    socket.on("connect_error", (error) => {
      console.log("connect_error", error);
      setMessage(error.message);
    });

    socket.on("stream", (stream: any) => {
      console.log("stream", stream);
      setStream(stream);
    });

    socket.on("disconnect", () => {
      console.log("disconnected from socket");
      setSocketId("disconnected");
      setMessage("socket disconnected");
    });

    socket.on("error", (error) => {
      console.log("error", error);
      setMessage(JSON.stringify(error));
    });
  };

  useEffect(() => {
    const { getToken, getPolicy } = helper(msalInstance);
    getToken()
      .then((token) => {
        const policy = getPolicy() || "";
        const idToken = token || "";
        handleSocket(idToken, policy);
      })
      .catch((error) => {
        setMessage(JSON.stringify(error.message));
      });
    return () => {
      socketIO.current?.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold">Socket.IO Test</h1>
        <p className="text-2xl font-bold text-center">Socket ID: {socketId}</p>
        <p className="font-bold text-center">Message: {message}</p>
        <textarea
          name=""
          id=""
          rows={10}
          cols={50}
          className="bg-black-900 rounded-md p-2"
          value={JSON.stringify(stream)}
        ></textarea>
        <div className="flex flex-row items-center gap-2 mt-4">
          <button className="p-2 rounded-md bg-blue-500" onClick={handleSend}>
            Get Stream
          </button>
        </div>
        <div className="flex flex-row items-center gap-2 mt-4">
          <input
            className="p-2 rounded-md text-black"
            type="text"
            name="userInput"
            id="userInput"
            value={userInput}
            onChange={handleChangeUserInput}
          />
          <button
            className="p-2 rounded-md bg-blue-500"
            onClick={handleSubmitUserInput}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestSocketIo;
