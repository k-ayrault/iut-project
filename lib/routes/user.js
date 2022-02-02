'use strict';

const Joi = require('joi');
const Encrypt = require('@ayrault/iut-encrypt');

module.exports = [
    {
        method: 'get',
        path: '/user',
        options: {
            tags: ['api']
        },
        handler: async (request, h) => {
            const { User } = request.models();

            const users = await User.query();

            return users;
        }
    },
    {
        method: 'post',
        path: '/user',
        options: {
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

            request.payload.password = Encrypt.sha1(request.payload.password);

            return await userService.create(request.payload);
        }
    },
    {
        method: 'DELETE',
        path: '/user/{id}',
        options: {
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
            tags: ['api'], validate: {
                params: Joi.object( {
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
    }
];
