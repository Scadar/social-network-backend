import {RoomsEvent, SocketWithUser} from '../../interfaces/socket';
import {CustomSocketIoServer} from '../../socket/CustomSocketIoServer';
import {notifications, notify} from '../../utils/notifications';

export class WSRooms {
  private readonly socket: SocketWithUser;
  private io: CustomSocketIoServer;

  constructor(io, socket) {
    this.socket = socket;
    this.io = io;
    this.socket.on(RoomsEvent.JOIN_ROOM, this.joinRoom);
    this.socket.on(RoomsEvent.LEAVE_ROOM, this.leaveRoom);
    this.socket.on('disconnect', this.leaveRoom)
  }

  joinRoom = async (roomId, callback) => {
    const socketUser = this.socket.user;
    const isUserAlreadyInRoom = await this.io.isUserAlreadyInRoom(
        roomId,
        socketUser,
    );
    await this.socket.join(roomId);
    if (!isUserAlreadyInRoom) {
      this.socket.to(roomId).emit(RoomsEvent.JOINED_TO_ROOM, socketUser);
      notify({
        socket: this.socket,
        roomId: roomId,
        notification: notifications.joinedToRoom(socketUser),
      });
    }
    const roomUsers = await this.io.getRoomUsers(roomId);
    callback(roomUsers);
  };

  leaveRoom = async (roomId) => {
    await this.socket.leave(roomId);
    await this.io.handleUserLeavingTheRoom(this.socket, roomId);
  };
}
