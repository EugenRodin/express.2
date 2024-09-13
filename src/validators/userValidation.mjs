import Joi from 'joi'
import { celebrate, Segments } from 'celebrate'

const userSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(0).max(120)
})

const validateUserPost = celebrate({
  [Segments.BODY]: userSchema
})

const validateUserPut = celebrate({
  [Segments.BODY]: userSchema
})

const validateParamsUserId = celebrate({
  [Segments.PARAMS]: {
    userId: Joi.number().integer().positive().required()
  }
})

export { validateUserPost, validateUserPut, validateParamsUserId }