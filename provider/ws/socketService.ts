import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient: Client;

export const connectWebSocket = (token: string, channel:string, onNotification: (message: any) => void) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS(`${process.env.EXPO_PUBLIC_API_URL}/ws`), // Ajusta al endpoint real
    connectHeaders: {
      Authorization: `Bearer ${token}`, // el interceptor en el backend tomará esto
    },
    debug: (str) => {
      console.log('STOMP:', str);
    },
    onConnect: () => {
      console.log('🔌 Conectado al WebSocket');

      stompClient.subscribe(channel, (message) => {
        if (message.body) {
          const data = JSON.parse(message.body);
          onNotification(data);
        }
      }),() => { console.log("📡 Suscripción activa")};
    },
    onStompError: (frame) => {
      console.error('❌ Error en STOMP:', frame);
    },
    reconnectDelay: 5000,
  });

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
};