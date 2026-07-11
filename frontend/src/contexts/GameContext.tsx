import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { GameContextType, GameState, Room, Player, GameAction } from '../types/game';
import { gameApi } from '../services/api';
import websocketService from '../services/websocket';
import { useAuth } from './AuthContext';

// Initial game state
const initialGameState: GameState = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  winner: null,
  isGameOver: false,
  playerX: null,
  playerO: null,
  roomId: null,
};

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token, user } = useAuth();
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Connect to WebSocket when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      websocketService.connect(token)
        .catch(err => {
          setError('Failed to connect to game server');
          console.error(err);
        });

      // Clean up on unmount
      return () => {
        websocketService.disconnect();
      };
    }
  }, [isAuthenticated, token]);

  // Set up WebSocket event listeners
  useEffect(() => {
    if (isAuthenticated) {
      // Listen for game updates
      websocketService.on('GAME_STATE_UPDATE', (data: GameState) => {
        setGameState(data);
      });

      // Listen for room updates
      websocketService.on('ROOMS_UPDATE', (data: Room[]) => {
        setRooms(data);
      });

      // Listen for errors
      websocketService.on('ERROR', (message: string) => {
        setError(message);
      });

      // Initial fetch of rooms
      refreshRooms();
    }

    // Clean up listeners
    return () => {
      websocketService.off('GAME_STATE_UPDATE', () => {});
      websocketService.off('ROOMS_UPDATE', () => {});
      websocketService.off('ERROR', () => {});
    };
  }, [isAuthenticated]);

  // Helper function to refresh rooms
  const refreshRooms = async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const roomsData = await gameApi.getRooms(token);
      setRooms(roomsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch rooms');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Game actions
  const createRoom = async (name: string) => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      await gameApi.createRoom(name, token);
      refreshRooms();
      setError(null);
    } catch (err) {
      setError('Failed to create room');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async (roomId: string) => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      //await gameApi.joinRoom(roomId, token);
      websocketService.joinRoom(roomId, token);
      setError(null);
    } catch (err) {
      setError('Failed to join room');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const joinRandomRoom = async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const { roomId } = await gameApi.joinRandomRoom(token);
      websocketService.joinRoom(roomId,token);
      setError(null);
    } catch (err) {
      setError('Failed to join random room');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const makeMove = (index: number) => {
    
    if (
      gameState.board[index] !== null ||
      gameState.isGameOver ||
      (gameState.currentPlayer === 'X' && gameState.playerX !== user?.id) ||
      (gameState.currentPlayer === 'O' && gameState.playerO !== user?.id)
    ) {
      return;
    }
    websocketService.makeMove(index);
  };

  const leaveRoom = () => {
    websocketService.leaveRoom();
    setGameState(initialGameState);
  };

  const value: GameContextType = {
    gameState,
    rooms,
    isLoading,
    error,
    createRoom,
    joinRoom,
    joinRandomRoom,
    makeMove,
    leaveRoom,
    refreshRooms,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Custom hook to use game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};