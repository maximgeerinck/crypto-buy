import mongoose from '../db';
import { MongoRepository, IRepositoryAdapter } from './repository';
import User, { IUser, IUserDAO, User as UserDomain } from '../models/user';
import { IUserCredential, IUserCredentialDAO } from '../models/UserCredential';

interface Repository {
  findCredentialByEmail(email: String): Promise<UserDomain>;
  findOneByEmail(email: string): Promise<UserDomain>;
}

class UserRepository extends MongoRepository<UserDomain> implements Repository {
  constructor() {
    super(User, 'User');
  }

  removeItem(_id: string, userId: mongoose.Types.ObjectId): Promise<boolean> {
    return this._model
      .update(
        { _id: userId },
        {
          $pull: {
            portfolio: { _id: _id }
          }
        }
      )
      .then(user => {
        return true;
      });
  }

  update(_id: mongoose.Types.ObjectId, item: UserDomain): Promise<UserDomain> {
    item.token = undefined;

    return this._model.update({ _id: _id }, item.toDAO()).then(result => {
      if (result && !result.ok) Promise.reject(result);
      return item;
    });
  }

  findCredentialByEmail(email: String): Promise<UserDomain> {
    return this.findOne({
      email: email,
      credentials: { $elemMatch: { expired: false } }
    }).then(user => this.parse(user));
  }

  findOneByEmail(email: string): Promise<UserDomain> {
    return this._model.findOne({ email: email }).select('-credentials').exec().then(user => this.parse(user));
  }
}

export default new UserRepository();
