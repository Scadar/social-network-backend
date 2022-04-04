import validateEnv from './utils/validateEnv';
import App from './app';
import UsersRoute from './components/user/UserRoute';
import FriendRoute from './components/friend/FriendRoute';
import ChatRoomRoute from './components/chat/chatRoom/ChatRoomRoute';
import ChatMessageRoute from './components/chat/chatMessage/ChatMessageRoute';
import AuthRoute from './components/auth/auth/AuthRoute';
import {WSChat} from './components/chat/WSChat';
import {WSRooms} from './components/chat/WSRooms';
import FileRoute from './components/disk/file/FileRoute';

validateEnv();

const app = new App([
      new UsersRoute(),
      new AuthRoute(),
      new FriendRoute(),
      new ChatRoomRoute(),
      new ChatMessageRoute(),
      new FileRoute(),
    ],
    (io, socket) => {
      new WSChat(io, socket);
      new WSRooms(io, socket);
    },
);

app.listen();

