import * as uuid from "uuid";
import { IUser, User } from "../models/user";
import UserCoin from "../models/UserCoin";
import UserCredential from "../models/UserCredential";
import ShareModel, { IUserShareSettings, UserShareSettings } from "../models/UserShareSettings";
import { key } from "../portfolio/PortfolioService";
import * as CacheHelper from "../utils/CacheHelper";
import { comparePassword, genSalt, hashPassword } from "../utils/cypher-util";
import * as CypherUtil from "../utils/cypher-util";
import NotFoundException from "./NotFoundException";
import ShareRepository from "./ShareRepository";
import UserRepository from "./UserRepository";

class UserService {
    public findOneById(id: any) {
        return UserRepository.findOneByIdWithShares(id);
    }

    public findUserByEmail(email: string): Promise<User> {
        return UserRepository.findOneByEmail(email);
    }

    public findOneByEmailAndToken(email: string, token: string): Promise<User> {
        return UserRepository.findOne({ email, token });
    }

    public verifyUser(email: string, password: string): Promise<IUser> {
        let verifiedUser: IUser = null;

        return UserRepository.findCredentialByEmail(email)
            .then((user) => {
                verifiedUser = user;
                return comparePassword(password, user.credentials[user.credentials.length - 1].password);
            })
            .then((res) => {
                if (!res) {
                    throw new NotFoundException(`Could not find user by email ${email}`);
                }
                return verifiedUser;
            });
    }

    public requestToken(email: string): Promise<string> {
        // check if exists
        return CypherUtil.genToken()
            .then((token) => {
                return UserRepository.findOneAndUpdate({ email }, { token });
            })
            .then((updatedUser) => {
                return updatedUser.token;
            });
    }

    public createUser(email: string, password: string): Promise<IUser> {
        const credential = new UserCredential("", "");
        credential.requestedOn = new Date();
        return genSalt()
            .then((salt) => {
                credential.salt = salt;
                return hashPassword(password, salt);
            })
            .then((hash) => {
                credential.password = hash;
                const user = new User(email, [ credential ], []);
                return UserRepository.create(user);
            });
    }

    public createCredentials(password: string): Promise<UserCredential> {
        return genSalt()
            .then((salt) => {
                return hashPassword(password, salt).then((hash) => [ salt, hash ]);
            })
            .then((params) => {
                return new UserCredential(params[1], params[0]);
            });
    }

    public update(user: User): Promise<User> {
        // invalidate caches
        CacheHelper.invalidate(key(user.id));
        return UserRepository.update(user.id, user);
    }

    public findUsersWithoutCredentials(): Promise<User[]> {
        return UserRepository.find({ credentials: { $size: 0 } });
    }

    public addCredentials(user: User, password: string): Promise<User> {
        return this.createCredentials(password).then((credentials) => {
            user.addCredentials(credentials);
            return this.update(user);
        });
    }

    public removeCoin(coinId: string, user: User): Promise<boolean> {
        return UserRepository.removeItem(coinId, user.id);
    }

    public sharePortfolio(
        user: User,
        amount: boolean = false,
        graph: boolean = false,
        change: boolean = false,
        price: boolean = false,
        currency: string = "USD"
    ): Promise<UserShareSettings> {
        const token = uuid.v4();

        const settings = new UserShareSettings(token, amount, graph, change, price, currency);
        settings.setUser(user);

        return ShareRepository.create(settings)
            .then((settings: any) => {
                user.addShare(settings);
                return this.update(user).then((_) => settings);
            })
            .catch((err) => console.log(err));
    }
}

export default new UserService();
