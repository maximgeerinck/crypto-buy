import { ValidationError } from './Validator';

abstract class ValidationConstraint {
    constraint: string;
    constructor(constraint: string = "ValidationConstraint") { 
        this.constraint = constraint;
    }
    abstract validate(): Promise<ValidationError>;
}

export default ValidationConstraint;