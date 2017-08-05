import * as uuid from "uuid";
import { IUser, User } from "../models/user";
import UserCoin from "../models/UserCoin";
import UserCredential from "../models/UserCredential";
import UserShareSettings from "../models/UserShareSettings";
import { comparePassword, genSalt, hashPassword } from "../utils/cypher-util";
import * as CypherUtil from "../utils/cypher-util";
import UserRepository from "./UserRepository";

class UserService {
    public findOneById(id: any) {
        return UserRepository.findOneById(id);
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
            .then(user => {
                verifiedUser = user;
                return comparePassword(password, user.credentials[user.credentials.length - 1].password);
            })
            .then(res => {
                if (!res) {
                    throw new Error("E_NOT_FOUND");
                }
                return verifiedUser;
            });
    }

    public requestToken(email: string): Promise<string> {
        // check if exists
        return CypherUtil.genToken()
            .then(token => {
                return UserRepository.findOneAndUpdate({ email }, { token });
            })
            .then(updatedUser => {
                return updatedUser.token;
            });
    }

    public createUser(email: string, password: string): Promise<IUser> {
        const credential = new UserCredential("", "");
        credential.requestedOn = new Date();
        return genSalt()
            .then(salt => {
                credential.salt = salt;
                return hashPassword(password, salt);
            })
            .then(hash => {
                credential.password = hash;
                const user = new User(email, [credential], []);
                return UserRepository.create(user);
            });
    }

    public createCredentials(password: string): Promise<UserCredential> {
        return genSalt()
            .then(salt => {
                return hashPassword(password, salt).then(hash => [salt, hash]);
            })
            .then(params => {
                return new UserCredential(params[1], params[0]);
            });
    }

    public update(user: User): Promise<User> {
        return UserRepository.update(user.id, user);
    }

    public getDetails(email: string): Promise<User> {
        return UserRepository.findOneByEmail(email);
    }

    public findUsersWithoutCredentials(): Promise<User[]> {
        return UserRepository.find({ credentials: { $size: 0 } });
    }

    public addCredentials(user: User, password: string): Promise<User> {
        return this.createCredentials(password).then(credentials => {
            user.addCredentials(credentials);
            return this.update(user);
        });
    }

    public removeCoin(coinId: string, user: User): Promise<boolean> {
        return UserRepository.removeItem(coinId, user.id);
    }

    public sharePortfolio(
        user: User,
        price: boolean = false,
        source: boolean = false,
        boughtAt: boolean = false,
        amount: boolean = false
    ): Promise<UserShareSettings> {
        const token = uuid.v4();
        const shareSettings = new UserShareSettings(token, price, source, boughtAt, amount);
        user.setShareSettings(shareSettings);

        return this.update(user).then(_ => shareSettings);
    }

    public getSharedPortfolio(token: string): Promise<any> {
        return UserRepository.getUserSharedPortfolio(token).then(user => {
            const portfolio: any = [];
            const settings: UserShareSettings = user.shareSettings;

            for (const coin of user.portfolio) {
                portfolio.push({
                    coinId: coin.coinId,
                    amount: settings.amount ? coin.amount : undefined,
                    boughtAt: settings.boughtAt ? coin.boughtAt : undefined,
                    boughtPrice: settings.price ? coin.boughtPrice : undefined,
                    source: settings.source ? coin.source : undefined
                });
            }

            return portfolio;
        });
    }
}

export default new UserService();
