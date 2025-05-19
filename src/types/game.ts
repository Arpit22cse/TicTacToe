export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[];

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  isGameOver: boolean;
  playerX: string | null; // user ID
  playerO: string | null; // user ID
  roomId: string | null;
}

export interface Room {
  id: string;
  name: string;
  createdBy: string;
  players: string[];
  status: 'waiting' | 'playing' | 'finished';
  createdAt: string;
}

export type GameAction = 
  | { type: 'JOIN_ROOM'; payload: { roomId: string; playerId: string } }
  | { type: 'CREATE_ROOM'; payload: { roomId: string; playerId: string } }
  | { type: 'MAKE_MOVE'; payload: { index: number; player: Player } }
  | { type: 'RESET_GAME' }
  | { type: 'SET_WINNER'; payload: Player | 'draw' }
  | { type: 'LEAVE_ROOM' };

export interface GameContextType {
  gameState: GameState;
  rooms: Room[];
  isLoading: boolean;
  error: string | null;
  createRoom: (name: string) => Promise<void>;
  joinRoom: (roomId: string) => Promise<void>;
  joinRandomRoom: () => Promise<void>;
  makeMove: (index: number) => void;
  leaveRoom: () => void;
  refreshRooms: () => Promise<void>;
}