import {SocketWithUser} from '../interfaces/socket';
import {verify} from 'jsonwebtoken';
import {JWT_ACCESS_SECRET_KEY} from '../config';
import {DataStoredInToken} from '../components/auth/auth/authInterface';
import {SocketUser} from './SocketUser';
import {HttpException} from '../exceptions/HttpException';
import {CustomSocketIoServer} from './CustomSocketIoServer';

export const socketAuthMiddleware = (io: CustomSocketIoServer) => async (socket: SocketWithUser, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const Authorization = token.split('Bearer ')[1];
      if (Authorization) {

        const user = (await verify(Authorization, JWT_ACCESS_SECRET_KEY)) as DataStoredInToken;
        const socketUser = new SocketUser(socket, user);
        io.addSocketUser(socketUser);
        socket.user = socketUser;
        next();
      } else {
        next(HttpException.unauthorized('Authentication token missing'));
      }
    } catch (error) {
      next(HttpException.unauthorized('Wrong authentication token'));
    }
  } else {
    next(HttpException.unauthorized('Authentication token missing'));
  }
};
