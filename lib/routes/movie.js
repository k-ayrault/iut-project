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

            const movie = await movieService.getMovie(request.params.id);

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
                    filmmaker: Joi.string().min(3).example('James Wan').description('Firstname of the user')
                })
            }
        },
        handler: async (request, h) => {

            const { User } = request.models();
            const { movieService } = request.services();
            const { sendMailService } = request.services();

            try {
                return await movieService.create(request.payload);
            }
            finally {

                const subject = request.payload.title + ' by ' + request.payload.filmmaker + ' available !! ';
                const text = request.payload.title + ' by ' + request.payload.filmmaker + ' is now available on our website !! Let\'s check it now !! ';
                let to = '';

                const mails = await User.query().select('mail');

                mails.forEach((mail, index) => {
                    to += mail.mail;
                    if (index !== mails.length - 1) {
                        to += ',';
                    }
                });
                sendMailService.sendMail(subject, text, to);
            }
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
                    filmmaker: Joi.string().min(3).example('James Wan').description('Firstname of the user')
                })
            }
        }, handler: async (request, h) => {

            const { UsersFavMovies } = request.models();
            const { User } = request.models();
            const { movieService } = request.services();
            const { sendMailService } = request.services();

            try {
                return await movieService.update(request.params, request.payload);
            }
            finally {

                const subject = request.payload.title + ' by ' + request.payload.filmmaker + ' available !! ';
                const text = request.payload.title + ' by ' + request.payload.filmmaker + ' is now available on our website !! Let\'s check it now !! ';
                let to = '';

                const users = await UsersFavMovies.query().select('id_user').where('id_movie', request.params.id);

                const mails = [];

                for (let i = 0; i < users.length; i++) {
                    mails.push(await User.query().select('mail').where('id', users[i].id_user));
                }

                for (let j = 0; j < mails.length; j++) {
                    to += mails[j][0].mail;
                    if (j < mails.length - 1) {
                        to += ',';
                    }
                }

                sendMailService.sendMail(subject, text, to);
            }
        }
    }
];
