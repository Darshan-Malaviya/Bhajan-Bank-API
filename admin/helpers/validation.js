import Joi from "joi";

export const idJoiSchema = Joi.object({
    id: Joi.string().alphanum().length(24).required(),
});

export const idValidator = (id) => {
    return idJoiSchema.validate({ id: id });
}