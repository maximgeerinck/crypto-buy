import * as Boom from "boom";
import * as Hapi from "hapi";
import NotFoundException from "../services/NotFoundException";
import { Notification } from "./Notification";
import NotificationRepository from "./NotificationRepository";

import CurrencyRepository from "../currency/CurrencyRepository";

class NotificationController {
    public async active(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const notifications = await NotificationRepository.findActive();
        return reply(notifications);
    }
}

export default new NotificationController();
