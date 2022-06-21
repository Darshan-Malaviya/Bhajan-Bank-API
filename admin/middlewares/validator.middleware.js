import {
	adminUserJoiSchema,
	categoryJoiSchema,
	idJoiSchema,
} from "../helpers/validation.js";
import { messagePusher } from "./message.middleware.js";

export const idValidationMiddleware = (req, res, next) => {
	const id = req.params.id;
	const validateResult = idJoiSchema.validate({ id: id });
	if (validateResult.error) {
		messagePusher(req, "danger", validateResult.error.message);
		return res.redirect(req.baseUrl);
	}
	next();
};

export const idValidationMiddlewareForApi = (req, res, next) => {
	const id = req.params.id;
	const validateResult = idJoiSchema.validate({ id: id });
	if (validateResult.error) {
		return res.send({
			status: false,
			message: validateResult.error.message,
		});
	}
	next();
};

export const categoryValidationMiddleware = (req, res, next) => {
	const category = req.body;
	const validateResult = categoryJoiSchema.validate(category);
	if (validateResult.error) {
		return res.send({
			status: false,
			message: validateResult.error.message,
		});
	}
	next();
};

export const adminUserValidationMiddleware = (req, res, next) => {
	const adminUser = req.body;
	const validateResult = adminUserJoiSchema.validate(adminUser);
	if (validateResult.error) {
		return res.send({
			status: false,
			message: validateResult.error.message,
		});
	}
	next();
};
