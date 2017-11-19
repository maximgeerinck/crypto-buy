import * as Joi from "joi";
import FeedbackController from "../feedback/FeedbackController";

module.exports = [
  {
    method: "POST",
    path: "/feedback",
    handler: FeedbackController.submit,
    config: {
      auth: false,
      validate: {
        payload: {
          message: Joi.string(),
          rating: Joi.number().min(1).max(5).required(),
          userId: Joi.string(),
          data: Joi.object()
        }
      }
    }
  },
  {
    method: "POST",
    path: "/feedback/update",
    handler: FeedbackController.update,
    config: {
      auth: false,
      validate: {
        payload: {
          id: Joi.string().required(),
          message: Joi.string(),
          createdOn: Joi.date(),
          rating: Joi.number().min(1).max(5).required(),
          userId: Joi.string(),
          data: Joi.object()
        }
      }
    }
  },
];
