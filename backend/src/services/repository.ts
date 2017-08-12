import mongoose from "../db";
import AbstractModel from "../models/AbstractModel";
import ModelFactory from "../models/ModelFactory";

export interface IRepositoryAdapter<Model, DAO> {
    modelToDao(model: Model): DAO;
    daoToModel(dao: DAO): Model;
}

export class MongoRepository<Model extends AbstractModel> {
    protected _model: mongoose.Model<mongoose.Document>;
    protected _type: string;

    constructor(schemaModel: mongoose.Model<mongoose.Document>, type: string) {
        this._model = schemaModel;
        this._type = type;
    }

    public create(item: Model): Promise<Model> {
        return this._model.create(item.toDAO()).then((item: any) => {
            return this.parse(item);
        });
    }

    public update(id: mongoose.Types.ObjectId, item: Model): Promise<Model> {
        return this._model.update({ _id: id }, item.toDAO()).then((result) => {
            if (result && !result.ok) {
                Promise.reject(result);
            }
            return item;
        });
    }

    public findOneAndUpdate(cond: object, fields: object, original: boolean = true): Promise<Model> {
        return this._model
            .findOneAndUpdate(cond, fields, { new: original })
            .then((item) => {
                const obj = this.parse(item);
                return obj;
            })
            .catch((err) => console.log(err));
    }

    public delete(id: string): Promise<void> {
        return this._model.remove({ _id: this.toObjectId(id) }).then((err) => {
            if (err) {
                Promise.reject(err);
            }
            Promise.resolve();
        });
    }

    public findById(id: string): Promise<Model> {
        return this._model.findById(id).then((item) => this.parse(item));
    }

    public findOne(cond?: object): Promise<Model> {
        return this._model.findOne(cond).then((item) => {
            if (!item) {
                throw new Error("E_NOT_FOUND");
            }
            return this.parse(item);
        });
    }

    public find(cond?: object, fields?: object, options?: object): Promise<Model[]> {
        const self = this;
        return this._model.find(cond, options).then((daos) => {
            return daos.map((dao) => self.parse(dao));
        });
        // .catch(err => console.log(err));
    }

    public parse(dao: any): any {
        return ModelFactory.parse(this._type, dao);
    }

    public findOneById(id: mongoose.Types.ObjectId) {
        return this.findOne({ _id: id });
    }

    private toObjectId(id: string): mongoose.Types.ObjectId {
        return mongoose.Types.ObjectId.createFromHexString(id);
    }
}
