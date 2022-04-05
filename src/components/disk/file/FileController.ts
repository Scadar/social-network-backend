import FileService from './FileService';
import {NextFunction, Response} from 'express';
import {RequestWithUser} from '../../auth/auth/authInterface';

class FileController {
  private fileService = new FileService();

  public createDir = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const {name, parentId} = req.body;
      const userId = req.user._id;
      const dir = await this.fileService.createDir(name, parentId, userId);
      res.status(201).json(dir);
    } catch (e) {
      next(e);
    }
  };

  public getFilesByParent = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const {parentId} = req.query;
      const userId = req.user._id;
      const files = await this.fileService.getFilesByParent(userId, parentId as string);
      res.status(200).json(files);
    } catch (e) {
      next(e);
    }
  };

  public getFilesByParentPath = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const {path} = req.body;
      const userId = req.user._id;
      const files = await this.fileService.getFilesByParentPath(userId, path);
      res.status(200).json(files);
    } catch (e) {
      next(e);
    }
  };

  public getFilesByPath = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const {path} = req.body;
      const userId = req.user._id;
      const files = await this.fileService.getFileByPath(userId, path);
      res.status(200).json(files);
    } catch (e) {
      next(e);
    }
  };
}

export default FileController;
