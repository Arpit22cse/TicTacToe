import React, { useEffect, useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { useAuth } from '../../contexts/AuthContext';
import Board from './Board';
import GameInfo from './GameInfo';

const GameBoard: React.FC = () => {
  const { gameState, makeMove, leaveRoom } = useGame();
  const { user } = useAuth();
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  
  const { board, currentPlayer, winner, isGameOver, playerX, playerO } = gameState;
  
  // Calculate if it's current player's turn
  const isCurrentPlayerTurn = 
    (currentPlayer === 'X' && user?.id === playerX) || 
    (currentPlayer === 'O' && user?.id === playerO);
  
  // Calculate winning line
  useEffect(() => {
    //console.log(playerO+"user "+user?.id);
    if (!winner || winner === 'draw') {
      setWinningLine(null);
      return;
    }
    
    // All possible winning combinations
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (const line of lines) {
      const [a, b, c] = line;
      if (
        board[a] && 
        board[a] === board[b] && 
        board[a] === board[c]
      ) {
        setWinningLine(line);
        return;
      }
    }
    
    setWinningLine(null);
  }, [winner, board]);
  
  return (
    <div className="flex flex-col items-center">
      <GameInfo 
        gameState={gameState} 
        onLeaveRoom={leaveRoom}
        currentUserId={user?.id}
      />
      
      <Board 
        board={board}
        onCellClick={makeMove}
        winningLine={winningLine}
        isCurrentPlayerTurn={isCurrentPlayerTurn}
        isGameOver={isGameOver}
      />
    </div>
  );
};

export default GameBoard;