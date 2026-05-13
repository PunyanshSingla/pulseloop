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

  public getIO() {
    return this.io;
  }
}

export const socketService = SocketService.getInstance();
