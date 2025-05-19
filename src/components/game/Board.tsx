import React from 'react';
import { CellValue } from '../../types/game';
import { motion } from 'framer-motion';

interface BoardProps {
  board: CellValue[];
  onCellClick: (index: number) => void;
  winningLine?: number[] | null;
  isCurrentPlayerTurn: boolean;
  isGameOver: boolean;
}

const Board: React.FC<BoardProps> = ({
  board,
  onCellClick,
  winningLine = null,
  isCurrentPlayerTurn,
  isGameOver,
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const isWinningCell = (index: number) => {
    return winningLine ? winningLine.includes(index) : false;
  };

  return (
    <motion.div
      className="grid grid-cols-3 gap-3 w-full max-w-md mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {board.map((cell, index) => (
        <motion.button
          key={index}
          className={`
            aspect-square rounded-lg flex items-center justify-center text-5xl font-bold
            ${isWinningCell(index) ? 'bg-green-100 border-green-400' : 'bg-white border-gray-200'}
            ${!cell && !isGameOver && isCurrentPlayerTurn 
              ? 'hover:bg-purple-50 hover:border-purple-300 hover:shadow-md' 
              : ''}
            border-2 transition-all duration-200 transform
            ${!cell && !isGameOver && isCurrentPlayerTurn ? 'cursor-pointer' : 'cursor-default'}
          `}
          onClick={() => !cell && !isGameOver && isCurrentPlayerTurn && onCellClick(index)}
          variants={itemVariants}
          whileHover={!cell && !isGameOver && isCurrentPlayerTurn ? { scale: 1.05 } : {}}
          whileTap={!cell && !isGameOver && isCurrentPlayerTurn ? { scale: 0.95 } : {}}
        >
          {cell && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`${cell === 'X' ? 'text-purple-600' : 'text-teal-500'}`}
            >
              {cell}
            </motion.span>
          )}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default Board;