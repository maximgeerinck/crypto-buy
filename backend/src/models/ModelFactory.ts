import { Coin } from "./Coin";
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
        }
    }
}
