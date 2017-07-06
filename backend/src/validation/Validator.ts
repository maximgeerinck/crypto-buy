import * as Boom from 'boom';
import ValidationConstraint from './ValidationConstraint';

export interface IValidationError {
  path: string;
  code: string;
  data?: any;
}

export class ValidationError implements IValidationError {
  path: string;
  code: string;
  data?: any;

  constructor(name: string, message: string, data?: any) {
    this.path = name;
    this.code = message;
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
      errors[this.errors[key].path] = { path: this.errors[key].path, code: this.errors[key].code };
    }
    return errors;
  }

  generateBadRequest(key: string = 'E_VALIDATION'): Boom.BoomError {
    console.log('generating bad request');
    // let boomErr = Boom.badRequest(key, this.toObject());

    var error: any = Boom.badRequest();
    error.reformat();
    error.output.payload.validation = this.toObject();
    // boomErr.output.payload.data = boomErr.data;
    return error;
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
