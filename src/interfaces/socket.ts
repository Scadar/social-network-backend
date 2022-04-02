import socketIo from 'socket.io';
import {SocketUser} from '../socket/SocketUser';

export interface SocketWithUser extends socketIo.Socket {
  user: SocketUser;
}

export enum ChatEvent {
  CHAT_MESSAGE = 'chat:chat-message',
  STARTED_TYPING = 'chat:started-typing',
  FINISHED_TYPING = 'chat:finished-typing',
}

export enum RoomsEvent {
  JOIN_ROOM = 'rooms:join-room',
  LEAVE_ROOM = 'rooms:leave-room',
  JOINED_TO_ROOM = 'rooms:joined-to-room',
  LEFT_THE_ROOM = 'rooms:left-the-room',
}

export enum SocketEvent {
  DISCONNECTING = 'disconnecting',
  RECONNECT = 'reconnect',
}

export enum NotificationsEvent {
  NOTIFICATION = 'notifications:notification',
}
