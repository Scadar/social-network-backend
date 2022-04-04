import {Router} from 'express';
import FileController from './FileController';
import {Routes} from '../../../interfaces/routesInterface';
import authMiddleware from '../../../middlewares/authMiddleware';

class FileRoute implements Routes {
  public path = '/files';
  public router = Router();
  private fileController = new FileController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
        `${this.path}/createDir`,
        authMiddleware,
        this.fileController.createDir,
    );
    this.router.get(
        `${this.path}`,
        authMiddleware,
        this.fileController.getFilesByParent,
    );
  }
}

export default FileRoute;
