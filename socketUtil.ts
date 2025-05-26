import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server | null = null;

export function initializeSocket(server: HttpServer): void {
  io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (_socket: Socket) => {
    console.log('Client connected');
  });
}

export function emitReportStatus(data: any): void {
  if (io) {
    io.emit('report-status', data);
  }
}

export function emitSessionStatus(data: any): void {
  if (io) {
    io.emit('session-status', data);
  }
}
