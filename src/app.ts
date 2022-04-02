import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import {connect, set} from 'mongoose';
import {CREDENTIALS, LOG_FORMAT, NODE_ENV, ORIGIN, PORT} from './config';
import errorMiddleware from './middlewares/errorMiddleware';
import {logger, stream} from './utils/logger';
import {Routes} from './interfaces/routesInterface';
import {dbConnection} from './database';
import path from 'path';
import fileUpload from 'express-fileupload';
import {createServer, Server} from 'http';
import express from 'express';
import {SocketWithUser} from './interfaces/socket';
import {CustomSocketIoServer} from './socket/CustomSocketIoServer';
import {socketAuthMiddleware} from './socket/socketAuthMiddleware';

class App {

  public app: express.Application;
  public server: Server;
  public io: CustomSocketIoServer;

  public env: string;
  public port: string | number;

  constructor(routes: Routes[], wsHandlers: (io: CustomSocketIoServer, socket: SocketWithUser) => void) {
    this.createApp();
    this.createServer();
    this.createSocketServer();
    this.initializeSocketHandlers(wsHandlers);

    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen = () => {
    this.server.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  };

  private initializeSocketHandlers = (wsHandlers: (io: CustomSocketIoServer, socket: SocketWithUser) => void) => {
    this.io.on('connection', (socket: SocketWithUser) => {
      wsHandlers(this.io, socket);
    });
  };

  private createApp = (): void => {
    this.app = express();
  };

  private createServer = (): void => {
    this.server = createServer(this.app);
  };

  private createSocketServer = (): void => {
    this.io = new CustomSocketIoServer(this.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    this.io.use(socketAuthMiddleware(this.io));
  };

  private connectToDatabase = () => {
    if (this.env !== 'production') {
      set('debug', false);
    }

    connect(dbConnection.url, dbConnection.options)
        .then(() => {
          logger.info(`Successfully connected to database`);
        })
        .catch(err => {
          logger.error(err);
        });
  };

  private initializeMiddlewares = () => {
    this.app.use(morgan(LOG_FORMAT, {stream}));
    this.app.use('/static', express.static(path.join(__dirname, 'static')));
    this.app.use(cors({
      origin: ORIGIN,
      credentials: CREDENTIALS,
    }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: true}));
    this.app.use(cookieParser());
    this.app.use(fileUpload());
  };

  private initializeRoutes = (routes: Routes[]) => {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  };

  private initializeErrorHandling = () => {
    this.app.use(errorMiddleware);
  };
}

export default App;
