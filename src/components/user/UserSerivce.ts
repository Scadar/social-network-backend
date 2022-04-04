import {hash} from 'bcrypt';
import {CreateUserInput} from './payload/CreateUserInput';
import {HttpException} from '../../exceptions/HttpException';
import {IUserDocument, IUserDtoWithRelationship} from './userInterface';
import userModel from './userModel';
import {isEmpty} from '../../utils/util';
import {v4 as uuid} from 'uuid';
import {Singleton} from '../../utils/Singleton';
import FsService from '../fs/FsService';
import {UploadedFile} from 'express-fileupload';
import {PaginationResponse} from '../../interfaces/pagintaionInterface';
import FriendService from '../friend/FriendService';
import UserDto from './UserDto';
import {UserToUserRelationship} from '../friend/friendInterface';

@Singleton
class UserService {
  public userModel = userModel;
  public fileService = new FsService();
  public friendService = new FriendService();

  public async findUsersByIds(ids: string[]): Promise<IUserDocument[]> {
    return this.userModel.find({_id: {$in: ids}});
  }

  public async findAllUser(): Promise<IUserDocument[]> {
    return this.userModel.find();
  }

  public async findUserById(userId: string): Promise<IUserDocument> {
    if (isEmpty(userId)) {
      throw HttpException.badRequest('User id is required');
    }

    const foundUser = await this.userModel.findById(userId);
    if (!foundUser) {
      throw HttpException.notFound(`User with id ${userId} not found`);
    }

    return foundUser;
  }

  public async findUserByEmail(email: string): Promise<IUserDocument> {
    if (isEmpty(email)) {
      throw HttpException.badRequest('Email is required');
    }

    const foundUser = await this.userModel.findOne({email});
    if (!foundUser) {
      throw HttpException.notFound(`User with email ${email} not found`);
    }

    return foundUser;
  }

  public async createUser(userData: CreateUserInput): Promise<IUserDocument> {
    if (isEmpty(userData)) {
      throw HttpException.badRequest('UserData is required');
    }

    const foundUser = await this.userModel.findOne({email: userData.email});
    if (foundUser) {
      throw HttpException.conflict(`User with email ${userData.email} already exists`);
    }

    const hashedPassword = await hash(userData.password, 10);
    const activationLink = uuid();

    return await this.userModel.create({...userData, password: hashedPassword, activationLink});
  }

  public async activateUserByActivationLink(activationLink: string): Promise<IUserDocument> {
    const user = await this.userModel.findOne({activationLink});
    if (!user) {
      throw HttpException.notFound(`User with activation link ${activationLink} not found`);
    }
    if (user.isActivated) {
      throw HttpException.conflict(`User with email ${user.email} is already activated`);
    }
    user.isActivated = true;
    user.activationLink = null;
    return await user.save();
  }

  public async updatePhotoProfile(userId: string, image: UploadedFile): Promise<IUserDocument> {
    if (!image) {
      throw HttpException.badRequest('Image is required');
    }
    if (!image.mimetype.includes('image')) {
      throw HttpException.badRequest('mimetype must be image');
    }
    const fileName = this.fileService.createFile(image);
    const user = await this.findUserById(userId);
    user.pictureURL = fileName;
    await user.save();

    return user;
  }

  public async deletePhotoProfile(userId: string): Promise<IUserDocument> {
    const user = await this.findUserById(userId);
    this.fileService.deleteFileByName(user.pictureURL);
    user.pictureURL = undefined;
    await user.save();
    return user;
  }

  public async findUsersWithFriendStatusByFirstNameOrLastName(
      requestUserId: string,
      firstName: string | null | undefined,
      lastName: string | null | undefined,
      page: number,
      pageSize: number,
  ) {

    const paginationUsers = await this.findUsersByFirstNameOrLastName(
        requestUserId,
        firstName,
        lastName,
        page,
        pageSize,
    );

    return {
      total: paginationUsers.total,
      page: paginationUsers.page,
      pageSize: paginationUsers.pageSize,
      data: await this.addFriendStatusToUsers(
          paginationUsers.data,
          requestUserId,
      ),
    };

  }

  public async findUsersByFirstNameOrLastName(
      requestUserId: string,
      firstName: string | null | undefined,
      lastName: string | null | undefined,
      page: number,
      pageSize: number,
  ): Promise<PaginationResponse<IUserDocument>> {
    if (!firstName && !lastName) {
      throw HttpException.badRequest('first name or last name required');
    }
    if (isEmpty(pageSize)) {
      throw HttpException.badRequest('limit is required');
    }
    if (isEmpty(page)) {
      throw HttpException.badRequest('page is required');
    }

    const regExpFirstName = this.getInsensitiveRegexByText(firstName);
    const regExpLastName = this.getInsensitiveRegexByText(lastName);

    let filterQuery;
    if (firstName && lastName) {
      filterQuery = {
        $or: [
          {firstName: regExpFirstName},
          {firstName: regExpLastName},
          {lastName: regExpFirstName},
          {lastName: regExpLastName},
        ],
        _id: {$ne: requestUserId},
      };
    } else if (firstName) {
      filterQuery = {
        $or: [
          {firstName: regExpFirstName},
          {lastName: regExpFirstName},
        ],
        _id: {$ne: requestUserId},
      };
    } else {
      filterQuery = {
        $or: [
          {firstName: regExpLastName},
          {lastName: regExpLastName},
        ],
        _id: {$ne: requestUserId},
      };
    }

    let total = await this.userModel
        .find(filterQuery)
        .skip(page * pageSize)
        .limit(pageSize)
        .count();

    const data = await this.userModel
        .find(filterQuery)
        .skip(page * pageSize)
        .limit(pageSize);

    return {
      data,
      page,
      pageSize,
      total,
    };
  }

  public async findUsersByFriendStatus(
      sourceId: string,
      status: UserToUserRelationship,
  ): Promise<IUserDtoWithRelationship[]> {
    if (!status) {
      throw HttpException.badRequest('status is required');
    }
    if (status === UserToUserRelationship.NOT_FRIEND) {
      throw HttpException.badRequest('forbidden to search');
    }
    const userIds = await this.friendService.findUserIdsByUserIdAndFriendStatus(sourceId, status);
    const foundUsers = await this.findUsersByIds(userIds);

    return UserDto.fromArrayUserDocuments(foundUsers).map(user => ({...user, friendStatus: status}));
  }

  public async addFriendStatusToUsers(
      userFriends: IUserDocument[],
      userId: string,
  ): Promise<IUserDtoWithRelationship[]> {
    if (!userFriends || userFriends.length === 0) {
      return [];
    }
    const friendRelationships = await this.friendService
        .findRelationshipUsersToUser(
            userId,
            userFriends.map(v => v._id),
        );

    return UserDto
        .fromArrayUserDocuments(userFriends)
        .map(userDto => {
          return {
            ...userDto,
            friendStatus: friendRelationships.get(userDto._id),
          };
        });
  }

  private getInsensitiveRegexByText(text: string): RegExp {
    return new RegExp(['^', text, '$'].join(''), 'i');
  }

}

export default UserService;
