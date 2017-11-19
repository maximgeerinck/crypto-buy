import * as Boom from "boom";
import * as Hapi from "hapi";
import NotFoundException from "../services/NotFoundException";
import { Feedback } from "./Feedback";
import FeedbackRepository from "./FeedbackRepository";

class FeedbackController {
    public async submit(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const feedbackObj: Feedback = new Feedback(req.payload.rating);
        const feedback = await FeedbackRepository.create(feedbackObj);
        reply(feedback);
    }

    public async update(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        console.log(req.payload);
        const feedbackObj = Feedback.parseDomain(req.payload);
        await FeedbackRepository.update(feedbackObj.id, feedbackObj);
        reply(feedbackObj);
    }
}

export default new FeedbackController();
