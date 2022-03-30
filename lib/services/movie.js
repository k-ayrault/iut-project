'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class MovieService extends Service {

    create(movie) {

        const { Movie } = this.server.models();

        return Movie.query().insertAndFetch(movie);
    }

    getMovie(movie) {
        const { Movie } = this.server.models();
        return Movie.query().findOne({
            id: movie.id
        });
    }

    delete(movie) {
        const { Movie } = this.server.models();

        return Movie.query().deleteById(movie.id);
    }

    update(id, movie) {
        const { Movie } = this.server.models();

        return Movie.query().updateAndFetchById(id.id, movie);
    }

};
