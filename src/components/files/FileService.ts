import {Singleton} from '../../utils/Singleton';
import * as fs from 'fs';
import * as path from 'path';
import {v4 as uuid} from 'uuid';
import {HttpException} from '../../exceptions/HttpException';
import {UploadedFile} from 'express-fileupload';

@Singleton
class FileService {

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
}

export default FileService;
