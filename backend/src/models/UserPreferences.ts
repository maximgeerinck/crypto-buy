import AbstractModel from "./AbstractModel";

export interface IUserPreferences {
    currency: string;
    initialInvestment: number;
}

export interface IUserPreferencesDAO {
    currency: string;
    initial_investment: number;
}

export default class UserPreferences extends AbstractModel implements IUserPreferences {
    public static parse(user: IUserPreferencesDAO): UserPreferences {
        return new UserPreferences(user.currency, user.initial_investment);
    }

    public static parseDomain(user: IUserPreferences): UserPreferences {
        return new UserPreferences(user.currency, user.initialInvestment);
    }

    public currency: string = "USD";
    public initialInvestment: number = 0;

    constructor(currency: string, initialInvestment: number = 0) {
        super();
        this.currency = currency;
        this.initialInvestment = initialInvestment;
    }

    public toDAO() {
        return {
            currency: this.currency,
            initial_investment: this.initialInvestment
        };
    }
}
