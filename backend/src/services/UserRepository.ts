import mongoose from '../db';
import { MongoRepository, IRepositoryAdapter } from './repository';
import User, { IUser, IUserDAO, IUserCredential, IUserCredentialDAO, User as UserDomain } from '../models/user';

interface Repository {
  findCredentialByEmail(email: String): Promise<IUser>;
  findOneByEmail(email: string): Promise<IUser>;
}

class UserRepository extends MongoRepository<UserDomain> implements Repository {
  constructor() {
    super(User, 'User');
  }

  update(_id: mongoose.Types.ObjectId, item: UserDomain): Promise<UserDomain> {
    item.token = undefined;

    return this._model.update({ _id: _id }, item.toDAO()).then(result => {
      if (result && !result.ok) Promise.reject(result);
      return item;
    });
  }

  findCredentialByEmail(email: String): Promise<IUser> {
    return this.findOne({
      email: email,
      credentials: { $elemMatch: { expired: false } }
    }).then(user => this.parse(user));
  }

  findOneByEmail(email: string): Promise<IUser> {
    return this._model.findOne({ email: email }).select('-credentials').exec().then(user => this.parse(user));
  }
}

export default new UserRepository();
