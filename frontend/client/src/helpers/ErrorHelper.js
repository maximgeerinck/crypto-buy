import * as types from "../error/ErrorActionTypes";

const timeoutError = (error) => ({ type: types.ERROR_TIMEOUT, body: error });
const knownError = (errors) => ({ type: types.ERROR_KNOWN, body: errors });
const unknownError = (errors) => ({ type: types.ERROR_UNKNOWN, body: errors });

export const handle = (error) => {

  if (error.body && error.body.validation) {
    return knownError(error.body.validation);
  }
  return unknownError(error);
};

export const timeout = (err) => ({ type: types.ERROR_TIMEOUT, body: err });