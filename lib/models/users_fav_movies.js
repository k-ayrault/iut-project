'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class UsersFavMovies extends Model {

    static get tableName() {

        return 'usersFavMovies';
    }

    static get joiSchema() {

        return Joi.object({
            id_movie: Joi.number().integer().description('Favorite movie ID'),
            id_user: Joi.number().integer().description('User\'s id')
        });
    }

    $beforeInsert(queryContext) {
    }

    $beforeUpdate(opt, queryContext) {
    }

};
