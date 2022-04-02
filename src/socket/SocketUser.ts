import socketIo from 'socket.io';
import {DataStoredInToken} from '../components/auth/auth/authInterface';

export class SocketUser {
  id: string;
  email: string;
  socketIds: string[];

  constructor(socket: socketIo.Socket, user: DataStoredInToken) {
    this.id = user._id
    this.email = user.email
    this.socketIds = [socket.id];
  }

  addSocket = (socket: socketIo.Socket): void => {
    this.socketIds.push(socket.id);
  };

  removeSocket = (socket: socketIo.Socket): void => {
    this.socketIds = this.socketIds.filter(
        (socketId) => socketId !== socket.id,
    );
  };

  hasSocket = (socketId: string): boolean => {
    return this.socketIds.includes(socketId);
  };

}
