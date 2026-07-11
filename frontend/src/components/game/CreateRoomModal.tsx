import React, { useState } from 'react';
import { X } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (name: string) => Promise<void>;
  isLoading: boolean;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onCreateRoom,
  isLoading,
}) => {
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomName.trim()) {
      setError('Room name is required');
      return;
    }
    
    try {
      await onCreateRoom(roomName);
      setRoomName('');
      setError(null);
      onClose();
    } catch (err) {
      setError('Failed to create room');
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
          disabled={isLoading}
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold text-gray-800 mb-4">Create Game Room</h2>
        
        <form onSubmit={handleSubmit}>
          <Input
            label="Room Name"
            placeholder="Enter a name for your game room"
            value={roomName}
            onChange={e => setRoomName(e.target.value)}
            error={error || undefined}
            fullWidth
            autoFocus
            disabled={isLoading}
          />
          
          <div className="flex space-x-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              fullWidth
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              fullWidth
            >
              Create Room
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;