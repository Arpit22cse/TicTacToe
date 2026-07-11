import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Grid3X3, RefreshCw, Plus, LogOut, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import Button from '../../components/ui/Button';
import RoomCard from '../../components/game/RoomCard';
import CreateRoomModal from '../../components/game/CreateRoomModal';
import GameBoard from '../../components/game/GameBoard';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const { isAuthenticated, user, logout, isLoading: authLoading } = useAuth();
  const { 
    gameState, 
    rooms, 
    isLoading, 
    error, 
    createRoom, 
    joinRoom, 
    joinRandomRoom, 
    refreshRooms 
  } = useGame();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated) {
      refreshRooms();
    }
  }, []);
  
  // Show login page if not authenticated
  if (!isAuthenticated && !authLoading) {
    return <Navigate to="/login" replace />;
  }
  
  const handleCreateRoom = async (name: string) => {
    await createRoom(name);
  };
  
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-purple-600 rounded-lg flex items-center justify-center shadow-md mr-3">
              <Grid3X3 size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Tic Tac Toe</h1>
          </div>
          
          {user && (
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-4">
                Hello, <span className="font-medium">{user.username}</span>
              </span>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                rightIcon={<LogOut size={16} />}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {gameState.roomId ? (
          // Game is in progress
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GameBoard />
          </motion.div>
        ) : (
          // Game lobby
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Game Lobby</h2>
              
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  variant="primary"
                  leftIcon={<Plus size={18} />}
                  className="flex-1 sm:flex-none"
                >
                  Create Room
                </Button>
                
                <Button
                  onClick={joinRandomRoom}
                  variant="secondary"
                  leftIcon={<Users size={18} />}
                  isLoading={isLoading}
                  className="flex-1 sm:flex-none"
                >
                  Join Random
                </Button>
                
                <Button
                  onClick={refreshRooms}
                  variant="outline"
                  leftIcon={<RefreshCw size={18} />}
                  isLoading={isLoading}
                  className="flex-1 sm:flex-none"
                >
                  Refresh
                </Button>
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Rooms</h3>
              
              {rooms.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                  <p className="text-gray-500">No game rooms available. Create one to start playing!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map(room => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onJoin={joinRoom}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </main>
      
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateRoom={handleCreateRoom}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Home;