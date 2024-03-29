import {
	adminUserJoiSchema,
	bookDataJoiSchema,
	bookJoiSchema,
	bookWordJoiSchema,
	categoryJoiSchema,
	contentTypeJoiSchema,
	idJoiSchema,
	loginJoiSchema,
	mediaJoiSchema,
	permissionJoiSchema,
	resetPasswordJoiSchema,
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

export const mediaValidationMiddleware = (req, res, next) => {
	const media = req.body;
	const validateResult = mediaJoiSchema.validate(media);
	if (validateResult.error) {
		messagePusher(req, "danger", validateResult.error.message);
		return res.redirect(req.originalUrl);
	}
	next();
};

export const contentTypeValidationMiddleware = (req, res, next) => {
	const contentType = req.body;
	const validateResult = contentTypeJoiSchema.validate(contentType);
	if (validateResult.error) {
		return res.send({
			status: false,
			message: validateResult.error.message,
		});
	}
	next();
};

export const permissionValidationMiddleware = (req, res, next) => {
	const permission = req.body;
	const validateResult = permissionJoiSchema.validate(permission);
	if (validateResult.error) {
		return res.send({
			status: false,
			message: validateResult.error.message,
		});
	}
	next();
};

export const loginValidationMiddleware = (req, res, next) => {
	const login = req.body;
	const validateResult = loginJoiSchema.validate(login);
	if (validateResult.error) {
		return res.send({
			status: false,
			message: validateResult.error.message,
		});
	}
	next();
};

export const resetPasswordValidationMiddleware = (req, res, next) => {
	const resetPassword = req.body;
	const validateResult = resetPasswordJoiSchema.validate(resetPassword);
	if (validateResult.error) {
		return res.send({
			status: false,
			message: validateResult.error.message,
		});
	}
	next();
};

export const bookValidationMiddleware = (req, res, next) => {
	const book = req.body;
	const validateResult = bookJoiSchema.validate(book);
	if (validateResult.error) {
		return res.send({
			status: false,
			message: validateResult.error.message,
		});
	}
	next();
};

export const bookDataValidationMiddleware = (req, res, next) => {
	const bookData = req.body;
	const validateResult = bookDataJoiSchema.validate(bookData);
	if (validateResult.error) {
		return res.send({
			status: false,
			message: validateResult.error.message,
		});
	}
	next();
};

export const bookWordValidationMiddleware = (req, res, next) => {
	const bookWord = req.body;
	const validateResult = bookWordJoiSchema.validate(bookWord);
	if (validateResult.error) {
		return res.send({
			status: false,
			message: validateResult.error.message,
		});
	}
	next();
};
