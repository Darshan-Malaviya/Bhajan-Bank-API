import { idValidator } from "../helpers/validation.js";
import { messagePusher } from "../middlewares/message.middleware.js";

export const idValidationMiddleware = (req, res, next) => {
    const id = req.params.id;
    const validateResult = idValidator(id);
    if (validateResult.error) {
        messagePusher(req, "danger", validateResult.error.message);
        return res.redirect(req.baseUrl);
    }
    next();
}

export const idValidationMiddlewareForApi = (req, res, next) => {
    const id = req.params.id;
    const validateResult = idValidator(id);
    if (validateResult.error) {
        return res.status(400).send(validateResult.error.message);
    }
    next();
}