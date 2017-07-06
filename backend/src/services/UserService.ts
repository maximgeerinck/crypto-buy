import UserRepository from './UserRepository';
import { genSalt, hashPassword, comparePassword } from '../utils/cypher-util';
import { IUser, User } from '../models/user';
import UserCredential from '../models/UserCredential';
import * as CypherUtil from '../utils/cypher-util';

class UserService {
  findOneById(_id: any) {
    return UserRepository.findOne({ _id: _id });
  }

  findUserByEmail(email: string): Promise<User> {
    return UserRepository.findOneByEmail(email);
  }

  findOneByEmailAndToken(email: string, token: string): Promise<User> {
    return UserRepository.findOne({ email: email, token: token });
  }

  verifyUser(email: string, password: string): Promise<IUser> {
    let verifiedUser: IUser = null;

    return UserRepository.findCredentialByEmail(email)
      .then(user => {
        verifiedUser = user;
        return comparePassword(password, user.credentials[user.credentials.length - 1].password);
      })
      .then(res => {
        if (!res) throw 'E_NOT_FOUND';
        return verifiedUser;
      });
  }

  requestToken(email: string): Promise<string> {
    // check if exists
    return CypherUtil.genToken()
      .then(token => {
        return UserRepository.findOneAndUpdate({ email: email }, { token: token });
      })
      .then(updatedUser => {
        return updatedUser.token;
      });
  }

  createUser(email: string, password: string): Promise<IUser> {
    let credential = new UserCredential('', '');
    credential.requestedOn = new Date();
    return genSalt()
      .then(salt => {
        credential.salt = salt;
        return hashPassword(password, salt);
      })
      .then(hash => {
        credential.password = hash;
        let user = new User(email, [credential], []);
        console.log(user);
        return UserRepository.create(user);
      });
  }

  createCredentials(password: string): Promise<UserCredential> {
    return genSalt()
      .then(salt => {
        return hashPassword(password, salt).then(hash => [salt, hash]);
      })
      .then(params => {
        return new UserCredential(params[1], params[0]);
      });
  }

  update(user: User): Promise<User> {
    return UserRepository.update(user._id, user);
  }

  getDetails(email: string): Promise<User> {
    return UserRepository.findOneByEmail(email);
  }

  findUsersWithoutCredentials(): Promise<Array<User>> {
    return UserRepository.find({ credentials: { $size: 0 } });
  }

  addCredentials(user: User, password: string): Promise<User> {
    return this.createCredentials(password).then(credentials => {
      user.addCredentials(credentials);
      return this.update(user);
    });
  }

  removeCoin(coinId: string, user: User): Promise<boolean> {
    return UserRepository.removeItem(coinId, user._id);
  }
}

export default new UserService();
