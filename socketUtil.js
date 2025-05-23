import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io = null;

export function initializeSocket(server) {
  io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (_socket) => {
    console.log('Client connected');
  });
}

export function emitReportStatus(data) {
  if (io) {
    io.emit('report-status', data);
  }
}

export function emitSessionStatus(data) {
  if (io) {
    io.emit('session-status', data);
  }
}
