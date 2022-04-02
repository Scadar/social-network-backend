import {Singleton} from '../../utils/Singleton';
import friendModel from './friendModel';
import {HttpException} from '../../exceptions/HttpException';
import {FriendStatus, IFriendDocument, UserToUserRelationship} from './friendInterface';
import {MongoId} from '../../interfaces/base';

@Singleton
class FriendService {

  private friendModel = friendModel;

  public async inviteFriend(sourceId: string, targetId: string) {

    const relationship = await this.findFriendRelationship(sourceId, targetId);

    if (!relationship) {
      const reverseRelationship = await this.findFriendRelationship(targetId, sourceId);

      if (reverseRelationship) {
        if (reverseRelationship.status === 'accepted') {
          throw HttpException.conflict('already friends');
        }
        reverseRelationship.status = 'accepted';
        await reverseRelationship.save();
      } else {
        await friendModel.create({
          sourceId,
          targetId,
          status: 'pending',
        });
      }
    } else {
      if (relationship.status === 'pending') {
        throw HttpException.conflict('request already sent');
      }
      if (relationship.status === 'accepted') {
        throw HttpException.conflict('already friends');
      }
      if (relationship.status === 'rejected') {
        throw HttpException.conflict('already invited');
      }
    }
  }

  public async deleteFriend(sourceId: string, targetId: string) {

    const relationship = await this.findFriendRelationship(sourceId, targetId);

    if (relationship) {
      await relationship.delete();

      if (relationship.status === 'accepted') {
        await this.friendModel.create({
          sourceId: targetId,
          targetId: sourceId,
          status: 'rejected',
        });
      }

      return;
    }

    const reverseRelationship = await this.findFriendRelationship(targetId, sourceId);

    if (reverseRelationship) {
      if (
          reverseRelationship.status === 'accepted' ||
          reverseRelationship.status === 'pending'
      ) {
        reverseRelationship.status = 'rejected';
        await reverseRelationship.save();
        return;
      }
      if (reverseRelationship.status === 'rejected') {
        throw HttpException.conflict('Not friends');
      }
      return;
    }

    throw HttpException.conflict('Not friends');
  }

  public async getUserToUserRelationship(sourceId: string, targetId: string): Promise<UserToUserRelationship> {

    const relationship = await this.findFriendRelationship(sourceId, targetId);
    if (relationship) {
      return this.getUserToUserRelationshipBySourceStatus(relationship.status);
    }

    const reverseRelationship = await this.findFriendRelationship(targetId, sourceId);
    if (reverseRelationship) {
      return this.getUserToUserRelationshipByTargetStatus(reverseRelationship.status);
    }
    return UserToUserRelationship.NOT_FRIEND;
  }

  public async findUserIdsByUserIdAndFriendStatus(userId: string, status: UserToUserRelationship): Promise<string[]> {
    if (status === UserToUserRelationship.NOT_FRIEND) {
      throw HttpException.badRequest('forbidden to search');
    }
    if (status === UserToUserRelationship.FRIEND) {
      const result = await this.friendModel.find({
        $or: [
          {userId, status: 'accepted'},
          {targetId: userId, status: 'accepted'},
        ],
      });
      return result.map(v => {
        if (v.sourceId.toString() === userId.toString()) {
          return v.targetId.toString();
        }
        if (v.targetId.toString() === userId.toString()) {
          return v.sourceId.toString();
        }
      });
    }
    if (status === UserToUserRelationship.REQUEST_SENT) {
      const result = await this.friendModel.find({sourceId: userId, status: 'pending'});
      return result.map(v => v.targetId.toString());
    }
    if (status === UserToUserRelationship.I_FOLLOWER) {
      const result = await this.friendModel.find({sourceId: userId, status: 'rejected'});
      return result.map(v => v.targetId.toString());
    }
    if (status === UserToUserRelationship.PENDING_ACTION) {
      const result = await this.friendModel.find({targetId: userId, status: 'pending'});
      return result.map(v => v.sourceId.toString());
    }
    if (status === UserToUserRelationship.YOUR_FOLLOWER) {
      const result = await this.friendModel.find({targetId: userId, status: 'rejected'});
      return result.map(v => v.sourceId.toString());
    }
  }

  public async findRelationshipUsersToUser(
      userId: string,
      userIds: MongoId[],
  ): Promise<Map<string, UserToUserRelationship>> {
    const result = new Map<string, UserToUserRelationship>();

    const relationships = await this.findRelationshipsBySourceIdAndTargetIds(userId, userIds);
    const reverseRelationships = await this.findRelationshipsByTargetIdAndSourceIds(userId, userIds);

    userIds.forEach(id => {
      const foundRelationship = relationships.find(
          v => v.sourceId.toString() === userId.toString() &&
              v.targetId.toString() === id.toString(),
      );
      if (foundRelationship) {
        result.set(id.toString(), this.getUserToUserRelationshipBySourceStatus(foundRelationship.status));
      } else {
        const foundReverseRelationship = reverseRelationships.find(
            v => v.sourceId.toString() === id.toString() &&
                v.targetId.toString() === userId.toString(),
        );
        if (foundReverseRelationship) {
          result.set(id.toString(), this.getUserToUserRelationshipByTargetStatus(foundReverseRelationship.status));
        } else {
          result.set(id.toString(), UserToUserRelationship.NOT_FRIEND);
        }
      }
    });

    return result;
  }

  private async findRelationshipsBySourceIdAndTargetIds(
      sourceId: string, targetIds: MongoId[]): Promise<IFriendDocument[]> {
    return this.friendModel.find({
      sourceId,
      targetId: {$in: targetIds},
    });
  }

  private async findRelationshipsByTargetIdAndSourceIds(
      targetId: string, sourceIds: MongoId[]): Promise<IFriendDocument[]> {
    return this.friendModel.find({
      sourceId: {$in: sourceIds},
      targetId,
    });
  }

  private getUserToUserRelationshipBySourceStatus(status: FriendStatus): UserToUserRelationship {
    if (status === 'accepted') {
      return UserToUserRelationship.FRIEND;
    }
    if (status === 'pending') {
      return UserToUserRelationship.REQUEST_SENT;
    }
    if (status === 'rejected') {
      return UserToUserRelationship.I_FOLLOWER;
    }
  }

  private getUserToUserRelationshipByTargetStatus(status: FriendStatus): UserToUserRelationship {
    if (status === 'accepted') {
      return UserToUserRelationship.FRIEND;
    }
    if (status === 'pending') {
      return UserToUserRelationship.PENDING_ACTION;
    }
    if (status === 'rejected') {
      return UserToUserRelationship.YOUR_FOLLOWER;
    }
  }

  private async findFriendRelationship(sourceId: string, targetId: string): Promise<IFriendDocument> {
    if (sourceId === targetId) {
      throw HttpException.badRequest('sourceId and targetId don\'t have to be equal');
    }
    if (!sourceId) {
      throw HttpException.badRequest('sourceId must not be empty');
    }
    if (!targetId) {
      throw HttpException.badRequest('targetId must not be empty');
    }

    return this.friendModel.findOne({sourceId, targetId});
  }
}

export default FriendService;
