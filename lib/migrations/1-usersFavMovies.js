'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.createTable('usersFavMovies', (table) => {
            table.integer('id_movie').unsigned().index().references('id').inTable('movie');
            table.integer('id_user').unsigned().index().references('id').inTable('user');
            table.primary(['id_movie', 'id_user']);
        });
    },

    async down(knex) {
        await knex.schema.dropTableIfExists('usersFavMovies');
    }
};
