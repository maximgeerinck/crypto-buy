import * as Boom from "boom";
import ValidationConstraint from "./ValidationConstraint";
import ValidationError, {IValidationError} from "./ValidationError";

class Validator {
    public errors: ValidationError[] = [];
    public constraints: ValidationConstraint[] = [];

    public addConstraint(constraint: ValidationConstraint) {
        this.constraints.push(constraint);
    }

    public addError(error: IValidationError) {
        if (error) { this.errors.push(error); }
    }

    public addErrors(errors: IValidationError[]) {
        if (!errors) return;
        for (let i = 0; i < errors.length; i++) {
            this.addError(errors[i]);
        }
    }

    public isValid(): boolean {
        return this.errors.length === 0;
    }

    public toObject() {
        const errors: any = {};
        for (const key in this.errors) {
            errors[this.errors[key].path] = { path: this.errors[key].path, code: this.errors[key].code };
        }
        return errors;
    }

    public generateBadRequest(key: string = "E_VALIDATION"): Boom.BoomError {
        const error: any = Boom.badRequest();
        error.reformat();
        error.output.payload.validation = this.toObject();
        // boomErr.output.payload.data = boomErr.data;
        return error;
    }

    public addValidation(constraint: ValidationConstraint) {
        this.constraints.push(constraint);
    }

    public async validate(): Promise<any> {
        for (const constraint of this.constraints){
            const error = await constraint.validate();
            if (!constraint.isValid) {
                this.addError(error);
            }
        }

        if (!this.isValid()) {
            throw this.toObject();
        }
        return this.isValid();
    }
}

export default Validator;
