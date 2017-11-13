import CoinRepository from "../coin/CoinCollectionRepository";
import mongoose from "../db";
import { User } from "../models/user";
import ShareModel, { UserShareSettings } from "../models/UserShareSettings";
import NotFoundException from "./NotFoundException";
import { IRepositoryAdapter, MongoRepository } from "./repository";

interface IShareRepository { }

class ShareRepository extends MongoRepository<UserShareSettings> implements IShareRepository {
    constructor() {
        super(ShareModel, "Share");
    }

    public findOneByToken(token: string): Promise<UserShareSettings> {
        return this._model.findOne({ token }).populate("user").then((dao: any) => {
            if (!dao) {
                throw new NotFoundException(`Couldn't find share with token ${token}`);
            }

            // lazy loading user
            const obj: UserShareSettings = this.parse(dao);
            obj.setUser(User.parse(dao.user));
            return obj;
        });
    }

    public async findShare(token: string): Promise<UserShareSettings> {
        return this.findOneByToken(token);
    }
}

export default new ShareRepository();
