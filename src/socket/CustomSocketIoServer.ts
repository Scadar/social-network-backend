import {RemoteSocket, Server} from 'socket.io';
import {DefaultEventsMap} from 'socket.io/dist/typed-events';
import {SocketUser} from './SocketUser';
import {Maybe} from '../interfaces/base';
import {ChatEvent, RoomsEvent, SocketWithUser} from '../interfaces/socket';
import {notifications, notify} from '../utils/notifications';

export class CustomSocketIoServer extends Server {

  public socketUsers = new Map<string, SocketUser>();

  public addSocketUser(socketUser: SocketUser): void {
    this.socketUsers.set(socketUser.id, socketUser);
  };

  public getSocketUsers = (): SocketUser[] => {
    return [...this.socketUsers.values()];
  };

  public getSocketUserById = (userId: string): Maybe<SocketUser> => {
    return this.socketUsers.get(userId);
  };

  public getRoomSockets = async (
      roomId: string,
  ): Promise<RemoteSocket<DefaultEventsMap, any>[]> => {
    return await this.in(roomId).fetchSockets();
  };

  public getSocketById = (socketId: string): Maybe<SocketWithUser> => {
    return this.of('/').sockets.get(socketId) as Maybe<SocketWithUser>;
  };

  public getUserBySocketId = (socketId: string): Maybe<SocketUser> => {
    const socket = this.getSocketById(socketId);
    return socket?.user;
  };

  public getRoomUsers = async (roomId: string): Promise<SocketUser[]> => {
    const roomSockets = await this.getRoomSockets(roomId);
    const roomUsers: SocketUser[] = [];

    for (const roomSocket of roomSockets) {
      const user = this.getUserBySocketId(roomSocket.id);
      if (user && !roomUsers.some((roomUser) => roomUser.id === user.id)) {
        roomUsers.push(user);
      }
    }
    return roomUsers;
  };

  public isUserAlreadyInRoom = async (
      roomId: string,
      user: SocketUser,
  ): Promise<boolean> => {
    const roomUsers = await this.getRoomUsers(roomId);
    return roomUsers.some((roomUser) => roomUser.id === user.id);
  };

  public getSocketRoomIds = (socket: SocketWithUser): string[] => {
    return [...socket.rooms.keys()];
  };

  public getUserRoomIds = (socket: SocketWithUser): string[] => {
    const {socketIds} = socket.user;
    const roomIds: string[] = [];
    socketIds.forEach((socketId) => {
      const socketRoomIds = this.sockets.adapter.sids.get(socketId);
      socketRoomIds?.forEach((roomId) => {
        if (!roomIds.includes(roomId)) {
          roomIds.push(roomId);
        }
      });
    });
    return roomIds;
  };

  public didUserLeaveTheRoomCompletely = async (
      roomId: string,
      leavingSocket: SocketWithUser,
  ): Promise<boolean> => {
    const roomSockets = await this.getRoomSockets(roomId);
    const userHasAnotherSocketInRoom = roomSockets.some((roomSocket) => {
      if (roomSocket.id === leavingSocket.id) {
        return false;
      }
      const roomSocketUser = this.getUserBySocketId(roomSocket.id);
      return roomSocketUser && roomSocketUser.id === leavingSocket.user.id;
    });
    return !userHasAnotherSocketInRoom;
  };

  public handleUserLeavingTheRoom = async (
      socket: SocketWithUser,
      roomId: string,
  ): Promise<void> => {
    const socketUser = socket.user;
    socket.to(roomId).emit(ChatEvent.FINISHED_TYPING, socketUser);
    const didUserLeaveTheRoomCompletely = await this.didUserLeaveTheRoomCompletely(
        roomId,
        socket,
    );
    if (didUserLeaveTheRoomCompletely) {
      socket.to(roomId).emit(RoomsEvent.LEFT_THE_ROOM, socketUser);
      notify({
        socket,
        roomId,
        notification: notifications.leftTheRoom(socketUser),
      });
    }
  };
}
