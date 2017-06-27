export default class JoiValidationErrorAdapter {
  errors: Array<any>;
  constructor(errors: Array<any>) {
    this.errors = errors;
  }

  convert() {
    let output: any = {};

    console.log(this.errors);

    this.errors.forEach(element => {
      output[element.path] = {
        path: element.path,
        code: element.type
      };

      if (element.context.limit) {
        output[element.path].data = { limit: element.context.limit };
      }
    });

    return output;
  }
}
