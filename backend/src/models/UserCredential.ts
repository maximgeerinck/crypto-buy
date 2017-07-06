import AbstractModel from './AbstractModel';

export interface IUserCredential {
  password: string;
  salt: string;
  requestedOn: Date;
  expired: boolean;
  expiredOn?: Date;
}
export interface IUserCredentialDAO {
  password: string;
  salt: string;
  requested_on: Date;
  expired: boolean;
  expired_on?: Date;
}
export default class UserCredential extends AbstractModel implements IUserCredential {
  requestedOn: Date = new Date();
  expiredOn?: Date;
  password: string;
  salt: string;

  constructor(password: string, salt: string, readonly expired: boolean = false) {
    super();
    this.password = password;
    this.salt = salt;
  }

  static parse(credential: IUserCredentialDAO): UserCredential {
    let credentialObj = new UserCredential(credential.password, credential.salt, credential.expired);
    credentialObj.requestedOn = credential.requested_on;
    credentialObj.expiredOn = credential.expired_on;
    return credentialObj;
  }

  static parseDomain(credential: IUserCredential): UserCredential {
    let credentialObj = new UserCredential(credential.password, credential.salt, credential.expired);
    credentialObj.requestedOn = credential.requestedOn;
    credentialObj.expiredOn = credential.expiredOn;
    return credentialObj;
  }

  toDAO() {
    let credentialDAO = {
      password: this.password,
      salt: this.salt,
      expired: this.expired,
      expired_on: this.expiredOn,
      requested_on: this.requestedOn
    };

    if (this.expiredOn) credentialDAO.expired_on = this.expiredOn;

    return credentialDAO;
  }
}
