export interface IUserShareSettings {
    token: string;
    price: boolean;
    source: boolean;
    boughtAt: boolean;
    amount: boolean;
}

export interface IUserShareSettingsDAO {
    token: string;
    price: boolean;
    source: boolean;
    bought_at: boolean;
    amount: boolean;
}

export default class UserShareSettings implements IUserShareSettings {
    public static parse(settings: IUserShareSettingsDAO): UserShareSettings {
        return new UserShareSettings(
            settings.token,
            settings.price,
            settings.source,
            settings.bought_at,
            settings.amount
        );
    }

    public static parseDomain(settings: IUserShareSettings): UserShareSettings {
        return new UserShareSettings(
            settings.token,
            settings.price,
            settings.source,
            settings.boughtAt,
            settings.amount
        );
    }

    constructor(
        readonly token: string,
        readonly price: boolean = false,
        readonly source: boolean = false,
        readonly boughtAt: boolean = false,
        readonly amount: boolean = false
    ) {}

    public toDAO(): IUserShareSettingsDAO {
        return {
            token: this.token,
            price: this.price,
            source: this.source,
            bought_at: this.boughtAt,
            amount: this.amount
        } as IUserShareSettingsDAO;
    }
}
