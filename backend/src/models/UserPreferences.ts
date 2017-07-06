import AbstractModel from './AbstractModel';

export interface IUserPreferences {
  currency: String;
  initialInvestment: Number;
}

export interface IUserPreferencesDAO {
  currency: String;
  initial_investment: Number;
}

export default class UserPreferences extends AbstractModel implements IUserPreferences {
  currency: String = 'USD';
  initialInvestment: Number = 0;

  constructor(currency: String, initialInvestment: Number = 0) {
    super();
    this.currency = currency;
    this.initialInvestment = initialInvestment;
  }

  toDAO() {
    return {
      currency: this.currency,
      initial_investment: this.initialInvestment
    };
  }

  static parse(user: IUserPreferencesDAO): UserPreferences {
    return new UserPreferences(user.currency, user.initial_investment);
  }

  static parseDomain(user: IUserPreferences): UserPreferences {
    return new UserPreferences(user.currency, user.initialInvestment);
  }
}
