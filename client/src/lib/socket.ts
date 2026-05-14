import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

class SocketClient {
  private static instance: SocketClient;
  public socket: Socket | null = null;

  private constructor() {}

  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  public connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      this.socket.on("connect", () => {
        console.log("🔌 Connected to PulseLoop real-time engine");
      });

      this.socket.on("disconnect", () => {
        console.log("🔌 Disconnected from real-time engine");
      });
    }
    return this.socket;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public joinPoll(pollId: string) {
    this.socket?.emit("join:poll", pollId);
  }

  public leavePoll(pollId: string) {
    this.socket?.emit("leave:poll", pollId);
  }

  public joinDashboard(userId: string) {
    this.socket?.emit("join:dashboard", userId);
  }

  public leaveDashboard(userId: string) {
    this.socket?.emit("leave:dashboard", userId);
  }
}

export const socketClient = SocketClient.getInstance();
