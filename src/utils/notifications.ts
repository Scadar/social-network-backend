import socketIo from 'socket.io';
import {NotificationsEvent, SocketWithUser} from '../interfaces/socket';
import {SocketUser} from '../socket/SocketUser';

export const notifications = {
  joinedToRoom: (user: SocketUser): string =>
      `${user.email} has joined to the conversation.`,
  leftTheRoom: (user: SocketUser): string =>
      `${user.email} has left the conversation.`,
};

interface NotifyArgs {
  socket: SocketWithUser;
  roomId: string;
  notification: string;
}

export const notify = ({socket, roomId, notification}: NotifyArgs): void => {
  socket.to(roomId).emit(NotificationsEvent.NOTIFICATION, notification);
};
