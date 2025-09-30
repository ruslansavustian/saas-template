import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: '/',
  cors: {
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      process.env.FRONTEND_URL,
      /\.vercel\.app$/,
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  },
  transports: ['websocket', 'polling'],
})
export class AppWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(AppWebSocketGateway.name);

  @WebSocketServer()
  server: Server;

  private activeConnections = 0;

  handleConnection(client: Socket) {
    this.logger.log(`WebSocket Client connected: ${client.id}`);
    this.activeConnections++;
    this.server.emit('activeConnections', this.activeConnections);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`WebSocket Client disconnected: ${client.id}`);
    this.activeConnections = Math.max(0, this.activeConnections - 1);
    this.server.emit('activeConnections', this.activeConnections);
  }

  @SubscribeMessage('getActiveConnections')
  handleGetActiveConnections(client: Socket) {
    client.emit('activeConnections', this.activeConnections);
  }
}
