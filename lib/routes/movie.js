'use strict';

const Joi = require('joi');
const Jwt = require('@hapi/jwt');

module.exports = [
    {
        method: 'get',
        path: '/movie',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api']
        },
        handler: async (request, h) => {
            const { Movie } = request.models();

            const movies = await Movie.query();

            return movies;
        }
    },
    {
        method: 'get',
        path: '/movie/{id}',
        options: {
            auth: {
                scope: ['admin', 'user']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().min(1).description('Id of the movie to get')
                })
            }
        },
        handler: async (request, h) => {

            const { movieService } = request.services();

            const movie = await movieService.getMovie(request.params);

            return movie;
        }
    },
    {
        method: 'post',
        path: '/movie',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    title: Joi.string().min(3).example('Saw').description('Title of the movie'),
                    description: Joi.string().min(8).example('Deux hommes se réveillent enchaînés au mur d\'une salle de bains. Ils ignorent où ils sont et ne se connaissent pas. Ils savent juste que l\'un doit absolument tuer l\'autre.').description('Description of the movie'),
                    releaseDate: Joi.date().example('2005-03-16').description('Release date of the movie'),
                    filmmaker: Joi.string().min(3).example('James Wan').description('Firstname of the user'),
                })
            }
        },
        handler: async (request, h) => {

            const { movieService } = request.services();

            return await movieService.create(request.payload);
        }
    },
    {
        method: 'DELETE',
        path: '/movie/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().min(1).description('Id of the movie to delete')
                })
            }
        },
        handler: async (request, h) => {

            const { movieService } = request.services();

            if (await movieService.delete(request.params)) {
                return '';
            }

            return 'error';
        }
    },
    {
        method: 'PATCH',
        path: '/movie/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'], validate: {
                params: Joi.object({
                    id: Joi.number().integer().min(1).description('Id of the user to delete')
                }),
                payload: Joi.object({
                    title: Joi.string().min(3).example('Saw').description('Title of the movie'),
                    description: Joi.string().min(8).example('Deux hommes se réveillent enchaînés au mur d\'une salle de bains. Ils ignorent où ils sont et ne se connaissent pas. Ils savent juste que l\'un doit absolument tuer l\'autre.').description('Description of the movie'),
                    releaseDate: Joi.date().example('2005-03-16').description('Release date of the movie'),
                    filmmaker: Joi.string().min(3).example('James Wan').description('Firstname of the user'),
                })
            }
        }, handler: async (request, h) => {

            const { movieService } = request.services();

            await movieService.update(request.params, request.payload);

            return 'error';
        }
    }
];
