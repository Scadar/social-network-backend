import {Singleton} from '../../../utils/Singleton';
import fileModel from './fileModel';
import FsService from '../../fs/FsService';
import {IFileDocument} from './fileInterface';

@Singleton
class FileService {
  private fileModel = fileModel;
  private fsService = new FsService();

  public createDir = async (dirName: string, parentId: string, userId: string) => {

    const parentDir = await this.fileModel.findById(parentId);

    let file: IFileDocument;
    let path: string = '';

    if (!parentDir) {
      path = dirName;
      await this.fsService.createDir(userId, path);
      file = await this.fileModel.create({
        path,
        name: dirName,
        type: 'folder',
        userId,
      });
    } else {
      path = `${parentDir.path}\\${dirName}`;
      await this.fsService.createDir(userId, path);
      file = await this.fileModel.create({
        path,
        name: dirName,
        type: 'folder',
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
}

export default FileService;
