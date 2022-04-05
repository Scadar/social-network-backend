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
        `${this.path}/byParentId`,
        authMiddleware,
        this.fileController.getFilesByParent,
    );
    this.router.post(
        `${this.path}/byParentPath`,
        authMiddleware,
        this.fileController.getFilesByParentPath,
    );
    this.router.post(
        `${this.path}/byPath`,
        authMiddleware,
        this.fileController.getFilesByPath,
    );
  }
}

export default FileRoute;
