import Joi from "joi";

export const idJoiSchema = Joi.object({
	id: Joi.string().alphanum().length(24).required(),
});

export const categoryJoiSchema = Joi.object(
	{
		name: Joi.string().min(3).max(30).required(),
		displayPosition: Joi.number().min(1).max(99).required(),
		csrfToken: Joi.string().length(32).required(),
	},
	{
		abortEarly: false,
		stripUnknown: true,
	}
);

export const adminUserJoiSchema = Joi.object(
	{
		name: Joi.string().min(3).max(30).required(),
		email: Joi.string().email().required(),
		csrfToken: Joi.string().length(32).required(),
		password: Joi.string().min(8).max(30),
	},
	{
		abortEarly: false,
		stripUnknown: true,
	}
);
