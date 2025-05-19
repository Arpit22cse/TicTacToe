import { GameAction, GameState } from '../types/game';
import { useAuth } from '../contexts/AuthContext';
//const auth = useAuth();
// Removed unused import 'useAuth' and fixed the module path issue
// Removed unused import 'useAuth'
class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private token: string | null = null;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: number | null = null;
  
  constructor(url: string) {
    this.url = url;
  }
  
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.token = token;
      try {
        this.socket = new WebSocket(`${this.url}`);
        
        this.socket.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        };
        
        this.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        this.socket.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.attemptReconnect();
        };
        
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
        
      } catch (error) {
        console.error('WebSocket connection error:', error);
        reject(error);
      }
    });
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    this.reconnectAttempts = 0;
    this.token = null;
  }
  
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts || !this.token) {
      console.log('Max reconnect attempts reached or no token available');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimeout = window.setTimeout(() => {
      this.connect(this.token!).catch(() => {
        this.attemptReconnect();
      });
    }, delay);
  }
  
  private handleMessage(message: { type: string; payload: any }) {
    const { type, payload } = message;
    
    const handlers = this.listeners.get(type) || [];
    handlers.forEach(handler => handler(payload));
  }
  
  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event)!.push(callback);
  }
  
  off(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) return;
    
    const handlers = this.listeners.get(event)!;
    this.listeners.set(
      event,
      handlers.filter(handler => handler !== callback)
    );
  }
  
  send(type: string, payload: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }
    
    this.socket.send(JSON.stringify({ type, payload }));
  }
  
  // Game-specific methods
  joinRoom(roomId: string, token: string) {
    this.send('JOIN_ROOM', { roomId, token});
  }
  
  createRoom(name: string) {
    this.send('CREATE_ROOM', { name});
  }
  
  makeMove(index: number) {
    this.send('MAKE_MOVE', { index});
  }
  
  leaveRoom() {
    this.send('LEAVE_ROOM', {});
  }
}

// Create a singleton instance
const websocketService = new WebSocketService('wss://backend-6qxr.onrender.com');

export default websocketService;