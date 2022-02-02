'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.createTable('user', (table) => {

            table.increments('id').primary();
            table.string('username').notNullable();
            table.string('password').notNullable();
            table.string('mail').notNullable();
            table.string('firstName').notNullable();
            table.string('lastName').notNullable();
            table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
            table.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
        });
    },

    async down(knex) {

        await knex.schema.dropTableIfExists('user');
    }
};
