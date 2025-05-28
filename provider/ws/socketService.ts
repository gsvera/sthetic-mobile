import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient: Client;

export const connectWebSocket = (token: string, onNotification: (message: any) => void) => {
  console.log("🚀 ~ token:", token)
  stompClient = new Client({
    webSocketFactory: () => new SockJS(`http://192.168.0.10:8002/ws`), // Ajusta al endpoint real
    connectHeaders: {
      Authorization: `Bearer ${token}`, // el interceptor en el backend tomará esto
    },
    debug: (str) => {
      console.log('STOMP:', str);
    },
    onConnect: () => {
      console.log('🔌 Conectado al WebSocket');

      stompClient.subscribe('/user/queue/notifications', (message) => {
        console.log("🚀 ~ stompClient.subscribe ~ message:", message)
        if (message.body) {
          const data = JSON.parse(message.body);
          console.log('📩 Notificación recibida:', data);
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