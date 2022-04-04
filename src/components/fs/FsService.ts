import {Singleton} from '../../utils/Singleton';
import * as fs from 'fs';
import * as path from 'path';
import {v4 as uuid} from 'uuid';
import {HttpException} from '../../exceptions/HttpException';
import {UploadedFile} from 'express-fileupload';
import {FILE_PATH} from '../../config';

@Singleton
class FsService {

  public createFile(file: UploadedFile): string {
    try {
      const fileName = uuid() + '.jpg';
      const filePath = path.resolve(__dirname, '..', '..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, {recursive: true});
      }
      fs.writeFileSync(path.join(filePath, fileName), file.data);
      return fileName;
    } catch (e) {
      throw HttpException.internalServerError('Ошибка при создании файла');
    }
  }

  public deleteFileByName(fileName: string) {
    try {
      const filePath = path.resolve(__dirname, '..', '..', 'static', fileName);
      fs.unlinkSync(filePath);
    } catch (e) {
      throw HttpException.internalServerError('Ошибка при удалении файла');
    }
  }

  public createDir = (userId: string, filePath: string) => {
    const dirPath = path.resolve(FILE_PATH, userId, filePath);
    console.log(dirPath)
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, {recursive: true});
          return resolve({path: dirPath});
        } else {
          return reject(HttpException.conflict(`File already exist`));
        }
      } catch (e) {
        return reject(HttpException.internalServerError(`Create dir error`));
      }
    });
  };
}

export default FsService;
