const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

exports.getUsersValidation = {
    query : Joi.object({
        page: Joi.number().integer().min(1).optional(),
        limit: Joi.number().integer().message('').min(1).optional()
    })
};

exports.loginValidation = {
    body: Joi.object({
        email: Joi.string().email({
            minDomainSegments: 2,
            tlds: { allow: ['com', 'net', 'in', 'org'] }
        }).required(),
        password: Joi.string().min(6).max(12).required(),
    })
}

exports.addUserValidation = {
    body: Joi.object({
        username: Joi.string().min(3).max(15).required(),
        email: Joi.string().email({
            minDomainSegments: 2,
            tlds: { allow: ['com', 'net', 'in', 'org'] }
        }).required(),
        phone: Joi.string().length(10).pattern(/^((\+91)?|91)?[6-9][0-9]{9}/).required(),
        password: Joi.string().min(6).max(12).required(),
        address: Joi.string().min(10).max(60),
    })
};

exports.updateUserValidation = {
    body: Joi.object({
        username: Joi.string().min(3).max(15).optional(),
        email: Joi.string().email({
            minDomainSegments: 2,
            tlds: { allow: ['com', 'net', 'in', 'org'] }
        }).optional(),
        phone: Joi.string().length(10).pattern(/^((\+91)?|91)?[6-9][0-9]{9}/).optional(),
        address: Joi.string().min(10).max(60)
    }),
    params: Joi.object({
        userId: Joi.objectId()
    }),
}

exports.getUserWithIdValidation = {
    params: Joi.object({
        userId: Joi.objectId()
    }),
}

exports.deleteUserValidation = {
    params: Joi.object({
        userId: Joi.objectId(),
    }),
};