import mongoose from "../db";
import User, { IUser, IUserDAO, User as UserDomain } from "../models/user";
import UserCoin from "../models/UserCoin";
import { IUserCredential, IUserCredentialDAO } from "../models/UserCredential";
import NotFoundException from "./NotFoundException";
import { IRepositoryAdapter, MongoRepository } from "./repository";

interface IUserRepository {
    findCredentialByEmail(email: string): Promise<UserDomain>;
    findOneByEmail(email: string): Promise<UserDomain>;
    findOneByIdWithShares(id: string): Promise<UserDomain>;
}

class UserRepository extends MongoRepository<UserDomain> implements IUserRepository {
    constructor() {
        super(User, "User");
    }

    public findOneByIdWithShares(id: string): Promise<UserDomain> {
        return this._model.findOne({ _id: id }).populate("shares").then((user) => {
            return this.parse(user);
        });
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

    public findOne(cond?: object): Promise<UserDomain> {
        return this._model.findOne(cond).populate("shares").then((item) => {
            if (!item) {
                throw new NotFoundException(JSON.stringify(cond));
            }
            return this.parse(item);
        });
    }

    public findOneByEmail(email: string): Promise<UserDomain> {
        return this._model.findOne({ email }).select("-credentials").then((user) => {
            return this.parse(user);
        });
    }
}

export default new UserRepository();
