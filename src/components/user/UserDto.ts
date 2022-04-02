import {IUserDocument} from './userInterface';

export default class UserDto {
  public _id: string;
  public email: string;
  public isActivated: boolean;
  public phone?: string;
  public firstName: string;
  public lastName: string;
  public statusDescription?: string;
  public gender: string;
  public pictureURL?: string;

  constructor(
      _id: string,
      email: string,
      isActivated: boolean,
      phone: string,
      firstName: string,
      lastName: string,
      statusDescription: string,
      gender: string,
      pictureURL: string
  ) {
    this._id = _id;
    this.email = email;
    this.isActivated = isActivated;
    this.phone = phone;
    this.firstName = firstName;
    this.lastName = lastName;
    this.statusDescription = statusDescription;
    this.gender = gender;
    this.pictureURL = pictureURL;
  }

  public static fromUserDocument(user: IUserDocument): UserDto {
    return new UserDto(
        user._id.toString(),
        user.email,
        user.isActivated,
        user.phone,
        user.firstName,
        user.lastName,
        user.statusDescription,
        user.gender,
        user.pictureURL
    );
  }

  public static fromArrayUserDocuments(users: IUserDocument[]): UserDto[] {
    return users.map(user => UserDto.fromUserDocument(user));
  }
}
