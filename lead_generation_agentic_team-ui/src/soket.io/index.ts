import { io } from "socket.io-client";

const socket = io("ws://localhost:5500/ws/role/email", {
    path: "",
    ackTimeout: 5000,
    autoConnect: false,
});

socket.on("connect", () => {
  console.log("connected");
});

export default socket;
