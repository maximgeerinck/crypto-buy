import * as Boom from "boom";
import * as Hapi from "hapi";
import * as userAgent from "useragent";
import { User } from "../models/user";
import NotFoundException from "../services/NotFoundException";
import { Feedback } from "./Feedback";
import FeedbackRepository from "./FeedbackRepository";

class FeedbackController {
    public async submit(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {

        const feedbackObj: Feedback = new Feedback(req.payload.rating);
        if (req.auth.isAuthenticated && req.auth) {
            feedbackObj.createdBy = req.auth.credentials as User;
        }

        const data = {
            ...req.payload.data,
            ip: req.info.remoteAddress,
            userAgent: {
                string: req.headers["user-agent"],
                ...userAgent.parse(req.headers["user-agent"]).toJSON()
            }
        };

        feedbackObj.data = data;

        try {
            const feedback = await FeedbackRepository.create(feedbackObj);
            reply(feedback);
        } catch (ex) {
            console.log(ex);
            reply(Boom.badRequest());
        }

    }

    public async update(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const feedbackObj = Feedback.parseDomain(req.payload);
        await FeedbackRepository.update(feedbackObj.id, feedbackObj);
        reply(feedbackObj);
    }
}

export default new FeedbackController();
