import { Coin } from "../coin/Coin";
import { CoinCollection } from "../coin/CoinCollection";
import { Feedback } from "../feedback/Feedback";
import { Notification } from "../notification/Notification";
import { User } from "./user";
import { UserShareSettings } from "./UserShareSettings";

export default class ModelFactory {
    public static parse(type: string, dao: any): any {
        switch (type) {
            case "User":
                return User.parse(dao);
            case "Share":
                return UserShareSettings.parse(dao);
            case "Coin":
                return Coin.parse(dao);
            case "Notification":
                return Notification.parse(dao);
            case "CoinCollection":
                return CoinCollection.parse(dao);
            case "Feedback":
                return Feedback.parse(dao);
        }
    }

    public static parseDomain(type: string, model: any): any {
        switch (type) {
            case "Notification":
                return Notification.parse(model);
        }
    }
}
