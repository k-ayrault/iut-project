'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class MovieService extends Service {

    create(movie) {

        const { Movie } = this.server.models();

        return Movie.query().insertAndFetch(movie);
    }

    getMovie(movie_id) {
        console.log(movie_id);
        const { Movie } = this.server.models();
        return Movie.query().findOne({
            id: movie_id
        });
    }

    update(id, movie) {
        const { Movie } = this.server.models();

        return Movie.query().updateAndFetchById(id.id, movie);
    }

    delete(movie) {
        const { Movie } = this.server.models();

        return Movie.query().deleteById(movie.id);
    }

};
