import * as Boom from 'boom';
import ValidationConstraint from './ValidationConstraint';

export interface IValidationError {
  name: string;
  message: string;
  data?: any;
}

export class ValidationError implements IValidationError {
  name: string;
  message: string;
  data?: any;

  constructor(name: string, message: string, data?: any) {
    this.name = name;
    this.message = message;
    this.data = data;
  }
}

class Validator {
  errors: Array<ValidationError> = [];
  constraints: Array<ValidationConstraint> = [];

  addError(error: IValidationError) {
    if (error) this.errors.push(error);
  }

  addErrors(errors: Array<IValidationError>) {
    if (!errors) return;
    for (let i = 0; i < errors.length; i++) {
      this.addError(errors[i]);
    }
  }

  isValid(): boolean {
    return this.errors.length === 0;
  }

  toObject() {
    let errors: any = {};
    for (let key in this.errors) {
      errors[this.errors[key].name] = { code: this.errors[key].message, data: this.errors[key].data };
    }
    return errors;
  }

  generateBadRequest(key: string = 'E_VALIDATION'): Boom.BoomError {
    let boomErr = Boom.badRequest(key, this.toObject());
    // boomErr.output.payload.data = boomErr.data;
    return boomErr;
  }

  addValidation(constraint: ValidationConstraint) {
    this.constraints.push(constraint);
  }

  validate(): Promise<any> {
    let self = this;
    return Promise.all(this.constraints.map(constraint => constraint.validate())).then(errors => {
      this.addErrors(errors);
      return self.isValid() ? Promise.resolve(true) : Promise.reject(this.toObject());
    });
  }
}

export default Validator;
