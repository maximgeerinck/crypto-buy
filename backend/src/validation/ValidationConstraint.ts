import ValidationError from "./ValidationError";

abstract class ValidationConstraint {
    public constraint: string;
    public isValid: boolean = false;
    constructor(constraint: string = "ValidationConstraint") {
        this.constraint = constraint;
    }
    public valid(): Promise<any> {
        this.isValid = true;
        return Promise.resolve(null);
    }
    public abstract validate(): Promise<ValidationError>;
}

export default ValidationConstraint;
