import mongoose from "../db";
import ModelFactory from "../models/ModelFactory";
import AbstractModel from "../models/NewAbstractModel";
import NotFoundException from "./NotFoundException";

export class MongoRepository<Model extends AbstractModel> {
    protected model: mongoose.Model<mongoose.Document>;
    protected type: string;

    constructor(schemaModel: mongoose.Model<mongoose.Document>, type: string) {
        this.model = schemaModel;
        this.type = type;
    }

    public create(item: Model): Promise<Model> {
        return this.model.create(item.toModel()).then((createdItem: any) => {
            return this.parse(createdItem);
        });
    }

    public createMany(items: Model[]) {
        return this.model.insertMany(items.map((item: Model) => item.toModel()));
    }

    public update(id: mongoose.Types.ObjectId, item: Model): Promise<Model> {
        return this.model.update({ _id: id }, item.toModel()).then((result) => {
            if (result && !result.ok) {
                Promise.reject(result);
            }
            return item;
        });
    }

    public findOneAndUpdate(cond: object, fields: object, original: boolean = true): Promise<Model> {
        return this.model
            .findOneAndUpdate(cond, fields, { new: original })
            .then((item) => {
                const obj = this.parse(item);
                return obj;
            })
            .catch((err) => console.log(err));
    }

    public delete(id: string): Promise<void> {
        return this.model.remove({ _id: this.toObjectId(id) })
            .then((err) => {
                if (err) {
                    Promise.reject(err);
                }
                Promise.resolve();
            })
            .catch((err) => console.log(err));
    }

    public findById(id: string): Promise<Model> {
        return this.model.findById(id).then((item) => this.parse(item));
    }

    public findOne(cond?: object): Promise<Model> {
        return this.model.findOne(cond).then((item) => {
            if (!item) {
                throw new NotFoundException(JSON.stringify(cond));
            }
            return this.parse(item);
        });
    }

    public find(cond?: object, fields?: object, options?: object): Promise<Model[]> {
        const self = this;
        return this.model.find(cond, options).then((daos) => {
            return daos.map((dao) => self.parse(dao));
        });
        // .catch(err => console.log(err));
    }

    public parse(dao: any): any {
        return ModelFactory.parse(this.type, dao);
    }

    public parseDomain(model: any): any {
        return ModelFactory.parseDomain(this.type, model);
    }

    public findOneById(id: mongoose.Types.ObjectId) {
        return this.findOne({ _id: id });
    }

    private toObjectId(id: string): mongoose.Types.ObjectId {
        return mongoose.Types.ObjectId.createFromHexString(id);
    }
}
