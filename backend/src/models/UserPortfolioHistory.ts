import AbstractModel from "./AbstractModel";

export interface IUserPortfolioHistoryItem {
    date: Date;
    value: number;
}

export interface IUserPortfolioHistoryItemDAO {
    date: Date;
    value: number;
}

export interface IUserPortfolioHistory {
    history: IUserPortfolioHistoryItem[];
}

export default class UserPortfolioHistory extends AbstractModel {
    public static parse(history: IUserPortfolioHistoryItemDAO[]): UserPortfolioHistory {
        return new UserPortfolioHistory(history);
    }

    public history: IUserPortfolioHistoryItem[] = [];

    constructor(history: IUserPortfolioHistoryItem[]) {
        super();
        this.history = history;
    }

    public toDAO() {
        return this.history.map((item: IUserPortfolioHistoryItem) => ({ date: item.date, value: item.value }));
    }
}
