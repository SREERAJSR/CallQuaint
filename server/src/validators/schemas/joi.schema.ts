import Joi, { ObjectSchema } from 'joi';
 
const PASSWORD_REGEX = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
);
export const authSignupSchema = Joi.object({
    firstname: Joi.string().alphanum().min(3).max(30).required(),
    lastname: Joi.string().alphanum().max(30).required(),
    email: Joi.string().email({ minDomainSegments:2, tlds: { allow: ['com', 'net'] } }).required(),
    gender: Joi.string().required(),
    password: Joi.string().pattern(PASSWORD_REGEX).min(8).required(),
    confirm_password:Joi.ref('password')
})

export const verifyRouteSchema = Joi.object({
    verificationToken:Joi.string().required()
})

export const authLoginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  password: Joi.string().pattern(PASSWORD_REGEX).min(8).required(),
})

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
})