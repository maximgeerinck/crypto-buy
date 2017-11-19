import { DEVELOPMENT } from "../constants";
import mongoose from "../db";
import { MongoRepository } from "../services/NewRepository";
import FeedbackModel, { Feedback, IFeedback, IFeedbackModel } from "./Feedback";

class FeedbackRepository extends MongoRepository<Feedback> {

    constructor() {
        super(FeedbackModel, "Feedback");
    }
}

export default new FeedbackRepository();
