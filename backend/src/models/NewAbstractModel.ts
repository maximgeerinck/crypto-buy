export abstract class AbstractModel {
    public toModel() {
        const model: any = this;
        model._id = model.id;
        delete model.id;
        return model;
    }
}

export default AbstractModel;