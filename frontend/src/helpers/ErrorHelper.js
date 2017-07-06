export const ERROR_TIMEOUT = 'error/timeout';
export const ERROR_KNOWN = 'errors/known';

const timeoutError = error => ({ type: ERROR_TIMEOUT, body: error });
const knownError = errors => ({ type: ERROR_KNOWN, body: errors });

export const handle = error => {
  // let errors = {};

  if (error.body && error.body.validation) {
    // let keys = Object.keys(error.body.validation);
    // for (let i = 0; i < keys.length; i++) {
    //   switch (error.body.validation[keys[i]].code) {
    //     case 'email.inUse':
    //       errors['email']
    //       errors.push('This email has already been registered');
    //       break;
    //   }
    // }

    return knownError(error.body.validation);
  }

  return timeoutError();
};
