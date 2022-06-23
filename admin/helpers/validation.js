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

export const mediaJoiSchema = Joi.object(
	{
		name: Joi.string().min(3).max(30).required(),
		type: Joi.string().min(3).max(30).required(),
		contentType: Joi.string().min(3).max(30).required(),
		csrfToken: Joi.string().length(32).required(),
	},
	{
		abortEarly: false,
		stripUnknown: true,
	}
);

export const contentTypeJoiSchema = Joi.object(
	{
		name: Joi.string().min(3).max(30).required(),
		identifier: Joi.string().min(3).max(30).required(),
		description: Joi.string().min(3).max(30).required(),
		csrfToken: Joi.string().length(32).required(),
	},
	{
		abortEarly: false,
		stripUnknown: true,
	}
);

export const permissionJoiSchema = Joi.object(
	{
		name: Joi.string().min(3).max(30).required(),
		identifier: Joi.string().min(3).max(30).required(),
		description: Joi.string().required(),
		contentType: Joi.string().min(3).max(30).required(),
		csrfToken: Joi.string().length(32).required(),
	},
	{
		abortEarly: false,
		stripUnknown: true,
	}
);

export const loginJoiSchema = Joi.object(
	{
		email: Joi.string().email().required(),
		password: Joi.string().min(8).max(30).required(),
		csrfToken: Joi.string().length(32).required(),
	},
	{
		abortEarly: false,
		stripUnknown: true,
	}
);

export const resetPasswordJoiSchema = Joi.object(
	{
		password: Joi.string().min(8).max(30).required(),
		confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
		csrfToken: Joi.string().length(32).required(),
	},
	{
		abortEarly: false,
		stripUnknown: true,
	}
);
