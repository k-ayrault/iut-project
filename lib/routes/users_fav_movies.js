'use strict';

const Joi = require('joi');
const Encrypt = require('@ayrault/iut-encrypt');
const Jwt = require('@hapi/jwt');

module.exports = [
    {
        method: 'get',
        path: '/movie/{id}/add_fav',
        options: {
            auth: {
                scope: ['admin', 'user']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().min(1).description('Id of the movie to add to fav')
                })
            }
        },
        handler: async (request, h) => {
            const { usersFavMoviesService } = request.services();

            const token = request.headers.authorization.split(' ')[1];

            try {
                return await usersFavMoviesService.addFavMovie(request.params, token);
            }
            catch (err) {
                if (err.message.includes('ER_DUP_ENTRY')) {
                    return 'Of course you like this movie, but he is already in your fav';
                }

                return 'This movie does not exist !!!';
            }
        }
    },
    {
        method: 'DELETE',
        path: '/movie/{id}/remove_fav',
        options: {
            auth: {
                scope: ['admin', 'user']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().min(1).description('Id of the movie to add to fav')
                })
            }
        },
        handler: async (request, h) => {
            const { usersFavMoviesService } = request.services();

            const token = request.headers.authorization.split(' ')[1];


            if (await usersFavMoviesService.removeFavMovie(request.params, token) != 1) {
                return 'This movie is not in your fav !!!';
            }
            else {
                return 'Movie correctly delete';
            }

        }
    }
];
