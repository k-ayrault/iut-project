'use strict';

const Joi = require('joi');
const Encrypt = require('@ayrault/iut-encrypt');
const Jwt = require('@hapi/jwt');

module.exports = [
    {
        method: 'get',
        path: '/user',
        options: {
            auth: {
                scope: ['admin', 'user']
            },
            tags: ['api']
        },
        handler: async (request, h) => {
            const { User } = request.models();

            const users = await User.query();

            return users;
        }
    },
    {
        method: 'get',
        path: '/user/{id}',
        options: {
            auth: {
                scope: ['admin', 'user']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().min(1).description('Id of the user to get')
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            const user = await userService.getUser(request.params);

            return user;
        }
    },
    {
        method: 'post',
        path: '/user',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    username: Joi.string().required().min(3).example('jdoe').description('Username of the user'),
                    password: Joi.string().required().min(8).example('password').description('Password of the user'),
                    mail: Joi.string().email().required().example('j.doe@gmail.fr').description('Mail of the user'),
                    firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user')
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();
            const { sendMailService } = request.services();

            request.payload.password = Encrypt.sha1(request.payload.password);

            try {
                return await userService.create(request.payload);
            }
            finally {
                const subject = 'Welcome !!!';
                const text = 'Welcome !! Your registration has been completed !!';
                const to = request.payload.mail;
                sendMailService.sendMail(subject, text, to);
            }
        }
    },
    {
        method: 'DELETE',
        path: '/user/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().min(1).description('Id of the user to delete')
                })
            }
        },
        handler: async (request, h) => {

            const { userService } = request.services();

            if (await userService.delete(request.params)) {
                return '';
            }

            return 'error';
        }
    },
    {
        method: 'PATCH', path: '/user/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'], validate: {
                params: Joi.object({
                    id: Joi.number().integer().min(1).description('Id of the user to delete')
                }),
                payload: Joi.object({
                    username: Joi.string().required().min(3).example('jdoe').description('Username of the user'),
                    password: Joi.string().min(8).required().example('password').description('Password of the user'),
                    mail: Joi.string().email().required().example('j.doe@gmail.fr').description('Mail of the user'),
                    firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user')
                })
            }
        }, handler: async (request, h) => {

            const { userService } = request.services();

            request.payload.password = Encrypt.sha1(request.payload.password);

            await userService.update(request.params, request.payload);

            return 'error';
        }
    },
    {
        method: 'POST', path: '/user/login',
        options: {
            auth: false,
            tags: ['api'], validate: {
                payload: Joi.object({
                    mail: Joi.string().email().required().example('j.doe@gmail.fr').description('Mail of the user'),
                    password: Joi.string().min(8).required().example('password').description('Password of the user')
                })
            }
        }, handler: async (request, h) => {

            const { userService } = request.services();

            request.payload.password = Encrypt.sha1(request.payload.password);
            const userLog = await userService.login(request.payload);
            if (userLog) {

                const token = Jwt.token.generate(
                    {
                        aud: 'urn:audience:iut',
                        iss: 'urn:issuer:iut',
                        firstName: userLog.firstName,
                        lastName: userLog.lastName,
                        email: userLog.mail,
                        scope: userLog.scope,
                        id: userLog.id
                    },
                    {
                        key: 'random_string', // La clé qui est définit dans lib/auth/strategies/jwt.js
                        algorithm: 'HS512'
                    },
                    {
                        ttlSec: 14400 // 4 hours
                    }
                );
                return token;
            }
            else {
                return h.response().code(401);
            }
        }
    }
];
