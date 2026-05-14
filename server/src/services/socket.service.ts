import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

export class SocketService {
  private static instance: SocketService;
  private io: Server | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initialize(server: HttpServer, clientUrl: string) {
    this.io = new Server(server, {
      cors: {
        origin: clientUrl,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.io.on("connection", (socket: Socket) => {
      console.log(`🔌 User connected: ${socket.id}`);

      socket.on("join:poll", (pollId: string) => {
        socket.join(`poll:${pollId}`);
        console.log(`👤 User ${socket.id} joined poll: ${pollId}`);
      });

      socket.on("leave:poll", (pollId: string) => {
        socket.leave(`poll:${pollId}`);
        console.log(`👤 User ${socket.id} left poll: ${pollId}`);
      });

      socket.on("join:dashboard", (userId: string) => {
        socket.join(`dashboard:${userId}`);
        console.log(`📊 User ${socket.id} joined dashboard: ${userId}`);
      });

      socket.on("leave:dashboard", (userId: string) => {
        socket.leave(`dashboard:${userId}`);
        console.log(`📊 User ${socket.id} left dashboard: ${userId}`);
      });

      socket.on("disconnect", () => {
        console.log(`🔌 User disconnected: ${socket.id}`);
      });
    });

    return this.io;
  }

  public emitToPoll(pollId: string, event: string, data: any) {
    if (!this.io) return;
    this.io.to(`poll:${pollId}`).emit(event, data);
  }

  public emitToDashboard(userId: string, event: string, data: any) {
    if (!this.io) return;
    this.io.to(`dashboard:${userId}`).emit(event, data);
  }

  public getIO() {
    return this.io;
  }
}

export const socketService = SocketService.getInstance();
