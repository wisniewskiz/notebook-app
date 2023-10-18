const joi = require('joi');

module.exports = validateNote = (req, res, next) => {
    const noteSchema = joi.object({
        note: joi.object({
            title: joi.string().required(),
            body: joi.string().required()
        }).required()
    });
    const { error } = noteSchema.validate(req.body);
    if(error) {
        const errorMessage = error.details.map(el => el.message).join(',');
        throw new AppError(errorMessage, 400);
    } else {
        next();
    };
};

