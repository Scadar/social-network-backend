import {Singleton} from '../../../utils/Singleton';
import fileModel from './fileModel';
import FsService from '../../fs/FsService';
import {IFileDocument} from './fileInterface';
import {HttpException} from '../../../exceptions/HttpException';

@Singleton
class FileService {
  private fileModel = fileModel;
  private fsService = new FsService();

  public createDir = async (dirName: string, parentId: string, userId: string) => {

    if (!dirName.trim()) {
      throw HttpException.badRequest('dirName must be not empty');
    }

    const parentDir = await this.fileModel.findById(parentId);

    let file: IFileDocument;
    let path: string = '';

    if (!parentDir) {
      path = dirName;
      await this.fsService.createDir(userId, path);
      file = await this.fileModel.create({
        parentPath: '',
        fullPath: path,
        name: dirName,
        type: 'dir',
        userId,
      });
    } else {
      path = `${parentDir.fullPath}\\${dirName}`;
      await this.fsService.createDir(userId, path);
      file = await this.fileModel.create({
        parentPath: parentDir.fullPath,
        fullPath: path,
        name: dirName,
        type: 'dir',
        userId,
        parentId: parentDir._id,
      });
      parentDir.childrenIds.push(file._id);
      await parentDir.save();
    }

    return file;
  };

  public getFileByIdAndUserId = async (fileId: string, userId: string) => {
    return this.fileModel.findOne({_id: fileId, userId});
  };

  public getFilesByParent = async (userId: string, parentId?: string) => {
    return this.fileModel.find({userId, parentId});
  };

  public getFilesByParentPath = async (userId: string, path: string) => {
    return this.fileModel.find({userId, parentPath: path});
  };

  public getFileByPath = async (userId: string, path: string) => {
    if (!path.trim()) {
      return {
        file: undefined,
        children: await this.fileModel.find({userId, parentPath: ''}),
      };
    } else {
      return {
        file: await this.fileModel.findOne({fullPath: path}),
        children: await this.fileModel.find({userId, parentPath: path}),
      };
    }
  };
}

export default FileService;
