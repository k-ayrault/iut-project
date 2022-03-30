'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Movie extends Model {

    static get tableName() {

        return 'movie';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(3).example('Saw').description('Title of the movie'),
            description: Joi.string().min(8).example('Deux hommes se réveillent enchaînés au mur d\'une salle de bains. Ils ignorent où ils sont et ne se connaissent pas. Ils savent juste que l\'un doit absolument tuer l\'autre.').description('Description of the movie'),
            releaseDate: Joi.date().example('2005-03-16').description('Release date of the movie'),
            filmmaker: Joi.string().min(3).example('James Wan').description('Firstname of the user'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }


    $beforeInsert(queryContext) {
        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }

};
