import { io, Socket } from 'socket.io-client';

class WebSocketManager {
  private socket: Socket | null = null;
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  connect() {
    if (this.socket) return;

    this.socket = io(this.url, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
export const wsManager = new WebSocketManager(wsUrl);
