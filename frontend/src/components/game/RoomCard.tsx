import React from 'react';
import { Users } from 'lucide-react';
import { Room } from '../../types/game';
import Card, { CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';

interface RoomCardProps {
  room: Room;
  onJoin: (roomId: string) => void;
  isLoading: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onJoin, isLoading }) => {
  const { id, name, players, status, createdAt } = room;
  
  const formattedDate = new Date(createdAt).toLocaleString();
  const isFull = players.length >= 2 ;
  
  const statusColors = {
    waiting: 'bg-amber-100 text-amber-800',
    playing: 'bg-blue-100 text-blue-800',
    finished: 'bg-green-100 text-green-800',
  };
  
  const statusText = {
    waiting: 'Waiting for players',
    playing: 'Game in progress',
    finished: 'Game finished',
  };
  
  return (
    <Card className="hover:translate-y-[-4px] transition-transform duration-300">
      <CardTitle>{name}</CardTitle>
      
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>
            {statusText[status]}
          </span>
          
          <div className="flex items-center text-gray-600 text-sm">
            <Users size={16} className="mr-1" />
            <span>{players.length}/2</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Created: {formattedDate}</p>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={() => onJoin(id)}
          variant={status === 'waiting' && !isFull ? 'primary' : 'outline'}
          fullWidth
          isLoading={isLoading}
          disabled={status !== 'waiting' || Boolean(isFull)}
        >
          {status === 'waiting' && !isFull 
            ? 'Join Room' 
            : status === 'playing' 
              ? 'Watch Game' 
              : status === 'finished' 
                ? 'Game Ended' 
                : 'Room Full'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;