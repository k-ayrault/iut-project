'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class User extends Model {

    static get tableName() {

        return 'user';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            username: Joi.string().min(3).example('jdoe').description('Username of the user'),
            password: Joi.string().min(8).example('password').description('Password of the user'),
            mail: Joi.string().email().example('j.doe@gmail.fr').description('Email of the user'),
            firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
            lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
            scope: Joi.array().items(Joi.string()).example(['user']).description('Scopes of the user'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }
    static get jsonAttributes() {
        return ['scope'];
    }

    $beforeInsert(queryContext) {
        this.scope = ['user'];
        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }

};
