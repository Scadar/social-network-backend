import ChatMessageService from './chatMessage/ChatMessageService';
import {ChatEvent, SocketWithUser} from '../../interfaces/socket';
import {CustomSocketIoServer} from '../../socket/CustomSocketIoServer';
import ChatMessageDto from './chatMessage/ChatMessageDto';

export class WSChat {
  private chatMessageService = new ChatMessageService();
  private readonly socket: SocketWithUser;
  private io: CustomSocketIoServer;

  constructor(io, socket) {
    this.socket = socket;
    this.io = io;
    this.socket.on(ChatEvent.CHAT_MESSAGE, this.chatMessage);
    this.socket.on(ChatEvent.STARTED_TYPING, this.startedTyping);
    this.socket.on(ChatEvent.FINISHED_TYPING, this.finishedTyping);
  }

  chatMessage = async (
      roomId: string,
      {message},
      callback: (message: ChatMessageDto) => void,
  ) => {
    const userId = this.socket.user.id;

    const createdMessage = await this.chatMessageService.createMessageWithUserInfo(
        userId,
        roomId,
        message,
    );

    this.socket.to(roomId).emit(ChatEvent.CHAT_MESSAGE, createdMessage);
    callback(createdMessage);
  };

  startedTyping = async (roomId: string) => {
    this.socket.to(roomId).emit(ChatEvent.STARTED_TYPING, this.socket.user);
  };

  finishedTyping = async (roomId: string) => {
    this.socket.to(roomId).emit(ChatEvent.FINISHED_TYPING, this.socket.user);
  };

}
