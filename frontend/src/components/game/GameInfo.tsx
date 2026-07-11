import React from 'react';
import { GameState } from '../../types/game';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

interface GameInfoProps {
  gameState: GameState;
  onLeaveRoom: () => void;
  currentUserId: string | undefined;
}

const GameInfo: React.FC<GameInfoProps> = ({ gameState, onLeaveRoom, currentUserId }) => {
  const { currentPlayer, winner, isGameOver, playerX, playerO } = gameState;
  
  const isPlayerX = currentUserId === playerX;
  const isPlayerO = currentUserId === playerO;
  const isSpectator = currentUserId && !isPlayerX && !isPlayerO;
  
  let statusMessage = "";
  
  if (winner) {
    statusMessage = winner === 'draw' 
      ? "It's a draw!" 
      : `Player ${winner} wins!`;
  } else if (isGameOver) {
    statusMessage = "Game over";
  } else if (
    (currentPlayer === 'X' && isPlayerX) || 
    (currentPlayer === 'O' && isPlayerO)
  ) {
    statusMessage = "Your turn";
  } else if (isPlayerX || isPlayerO) {
    statusMessage = "Opponent's turn";
  } else {
    statusMessage = `Player ${currentPlayer}'s turn`;
  }
  
  return (
    <motion.div
      className="mb-8 text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center items-center space-x-6 mb-4">
        <div className={`px-4 py-2 rounded-lg ${currentPlayer === 'X' ? 'bg-purple-100 border-2 border-purple-300' : 'bg-gray-100'}`}>
          <span className="text-lg font-semibold text-purple-600">Player X</span>
          {isPlayerX && <span className="text-xs block text-gray-500">(You)</span>}
        </div>
        
        <div className="text-gray-400">vs</div>
        
        <div className={`px-4 py-2 rounded-lg ${currentPlayer === 'O' ? 'bg-teal-100 border-2 border-teal-300' : 'bg-gray-100'}`}>
          <span className="text-lg font-semibold text-teal-500">Player O</span>
          {isPlayerO && <span className="text-xs block text-gray-500">(You)</span>}
        </div>
      </div>
      
      <motion.div 
        className={`
          text-xl font-bold mb-4 px-4 py-2 rounded-lg inline-block
          ${winner === 'X' ? 'bg-purple-100 text-purple-700' : 
            winner === 'O' ? 'bg-teal-100 text-teal-700' : 
            winner === 'draw' ? 'bg-amber-100 text-amber-700' :
            'bg-blue-100 text-blue-700'}
        `}
        animate={{
          scale: [1, 1.05, 1],
          transition: { duration: 0.5, repeat: winner ? Infinity : 0, repeatType: "reverse" }
        }}
      >
        {statusMessage}
      </motion.div>
      
      {isSpectator && (
        <div className="text-sm text-gray-500 mb-4">
          You are spectating this game
        </div>
      )}
      
      <Button
        onClick={onLeaveRoom}
        variant="outline"
        size="sm"
      >
        Leave Game
      </Button>
    </motion.div>
  );
};

export default GameInfo;