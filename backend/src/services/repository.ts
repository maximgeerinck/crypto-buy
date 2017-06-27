import mongoose from '../db';
import AbstractModel from '../models/AbstractModel';
import ModelFactory from '../models/ModelFactory';

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

  create(item: Model): Promise<Model> {
    return this._model.create(item.toDAO()).then(item => this.parse(item));
  }

  update(_id: mongoose.Types.ObjectId, item: Model): Promise<Model> {
    return this._model.update({ _id: _id }, item.toDAO()).then(result => {
      if (result && !result.ok) Promise.reject(result);
      return item;
    });
  }

  findOneAndUpdate(cond: Object, fields: Object, original: boolean = true): Promise<Model> {
    return this._model
      .findOneAndUpdate(cond, fields, { new: original })
      .then(item => {
        let obj = this.parse(item);
        return obj;
      })
      .catch(err => console.log(err));
  }

  delete(_id: string): Promise<void> {
    return this._model.remove({ _id: this.toObjectId(_id) }).then(err => {
      if (err) Promise.reject(err);
      Promise.resolve();
    });
  }

  findById(_id: string): Promise<Model> {
    return this._model.findById(_id).then(item => this.parse(item));
  }

  findOne(cond?: Object): Promise<Model> {
    let self = this;
    return this._model.findOne(cond).then(item => {
      if (!item) throw 'E_NOT_FOUND';
      return this.parse(item);
    });
  }

  find(cond?: Object, fields?: Object, options?: Object): Promise<Array<Model>> {
    let self = this;
    return this._model
      .find(cond, options)
      .then(daos => {
        return daos.map(dao => self.parse(dao));
      })
      .catch(err => console.log(err));
  }

  parse(dao: any): any {
    return ModelFactory.parse(this._type, dao);
  }

  private toObjectId(_id: string): mongoose.Types.ObjectId {
    return mongoose.Types.ObjectId.createFromHexString(_id);
  }
}
