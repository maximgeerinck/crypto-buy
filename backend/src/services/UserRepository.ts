import mongoose from "../db";
import User, { IUser, IUserDAO, User as UserDomain } from "../models/user";
import UserCoin from "../models/UserCoin";
import { IUserCredential, IUserCredentialDAO } from "../models/UserCredential";
import { IRepositoryAdapter, MongoRepository } from "./repository";

interface IUserRepository {
    findCredentialByEmail(email: string): Promise<UserDomain>;
    findOneByEmail(email: string): Promise<UserDomain>;
}

class UserRepository extends MongoRepository<UserDomain> implements IUserRepository {
    constructor() {
        super(User, "User");
    }

    public removeItem(id: string, userId: mongoose.Types.ObjectId): Promise<boolean> {
        return this._model
            .update(
                { _id: userId },
                {
                    $pull: {
                        portfolio: { _id: id }
                    }
                }
            )
            .then((user) => {
                return true;
            });
    }

    public update(id: mongoose.Types.ObjectId, item: UserDomain): Promise<UserDomain> {
        item.token = undefined;

        return this._model.update({ _id: id }, item.toDAO()).then((result) => {
            if (result && !result.ok) {
                Promise.reject(result);
            }
            return item;
        });
    }

    public findCredentialByEmail(email: string): Promise<UserDomain> {
        return this.findOne({
            email,
            credentials: { $elemMatch: { expired: false } }
        });
    }

    public findOneByEmail(email: string): Promise<UserDomain> {
        return this._model.findOne({ email }).select("-credentials").exec().then((user) => this.parse(user));
    }

    public getUserSharedPortfolio(token: string): Promise<UserDomain> {
        return this._model.findOne({ "shareSettings.token": token }).then((u) => {
            const user = this.parse(u);
            return user;
        });
    }
}

export default new UserRepository();
