import mongoose from "../db";
import { User } from "../models/user";
import ShareModel, { UserShareSettings } from "../models/UserShareSettings";
import { IRepositoryAdapter, MongoRepository } from "./repository";

interface IShareRepository {}

class ShareRepository extends MongoRepository<UserShareSettings> implements IShareRepository {
    constructor() {
        super(ShareModel, "Share");
    }

    public findOneByToken(token: string): Promise<UserShareSettings> {
        return this._model.findOne({ token }).populate("user").then((dao: any) => {
            // lazy loading user
            const obj: UserShareSettings = this.parse(dao);
            obj.setUser(User.parse(dao.user));
            return obj;
        });
    }
}

export default new ShareRepository();
