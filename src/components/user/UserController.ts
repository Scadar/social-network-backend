import {NextFunction, Request, Response} from 'express';
import UserService from './UserSerivce';
import UserDto from './UserDto';
import {RequestWithUser} from '../auth/auth/authInterface';
import {UploadedFile} from 'express-fileupload';
import {UserToUserRelationship} from '../friend/friendInterface';

class UsersController {
  public userService = new UserService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData = await this.userService.findAllUser();

      res.status(200).json(UserDto.fromArrayUserDocuments(findAllUsersData));
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.userId;
      const user = await this.userService.findUserById(userId);

      res.status(200).json(UserDto.fromUserDocument(user));
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData = await this.userService.findUserById(req.user._id);

      res.status(200).json(UserDto.fromUserDocument(userData));
    } catch (error) {
      next(error);
    }
  };

  public updatePhotoProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }
      if (Object.keys(req.files).length > 1) {
        return res.status(400).send('File must be one');
      }
      const file = req.files.img as UploadedFile;
      const user = await this.userService.updatePhotoProfile(req.user._id, file);

      res.status(200).json(UserDto.fromUserDocument(user));
    } catch (error) {
      next(error);
    }
  };

  public deletePhotoProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.deletePhotoProfile(req.user._id);
      res.status(200).json(UserDto.fromUserDocument(user));
    } catch (error) {
      next(error);
    }
  };

  public findUserByFirstNameAndLastName = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const {firstName, lastName, page, pageSize} = req.query;
      const paginationUsers = await this.userService.findUsersWithFriendStatusByFirstNameOrLastName(
          req.user._id,
          firstName as string,
          lastName as string,
          Number(page),
          Number(pageSize),
      );
      res.status(200).json(paginationUsers);
    } catch (error) {
      next(error);
    }
  };

  public findUsersByFriendStatus = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const {status} = req.query;
      const users = await this.userService.findUsersByFriendStatus(req.user._id, status as UserToUserRelationship);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
