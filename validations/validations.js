import {body} from 'express-validator'

export const registrationValidation = [
    body('email', 'Wrong email').isEmail(),
    body('password', 'Wrong password').isLength({min: 5}),
    body('fullName', 'Enter fullName').isLength({min: 4}),
    body('avatarUrl','Wrong image url').optional().isURL(),

]
export const loginValidation = [
    body('email', 'Wrong email').isEmail(),
    body('password', 'Wrong password').isLength({min: 5}),


]
export const postCreateValidation = [
    body('text','Enter text').isString(),
    body('title','Enter title').isLength({min: 3}).isString(),
    body('tags', 'Wrong tag').optional().isString(),
    body('imageUrl', 'Wrong image url').optional().isString(),

]