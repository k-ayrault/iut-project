'use strict';

const { Service } = require('@hapipal/schmervice');
const Jwt = require('@hapi/jwt');

module.exports = class UsersFavMoviesService extends Service {

    addFavMovie(movie, userToken) {

        const { UsersFavMovies } = this.server.models();
        const usersFavMovie = new UsersFavMovies();
        usersFavMovie.id_movie = movie.id;
        usersFavMovie.id_user = Jwt.token.decode(userToken).decoded.payload.id;

        return UsersFavMovies.query().insert(usersFavMovie);
    }

    removeFavMovie(movie, userToken) {

        const { UsersFavMovies } = this.server.models();

        return UsersFavMovies.query().delete().where('id_movie', movie.id).where('id_user', Jwt.token.decode(userToken).decoded.payload.id);
    }

    getFavMovie(userToken) {

        const { UsersFavMovies } = this.server.models();

        return UsersFavMovies.query().select().where('id_user', Jwt.token.decode(userToken).decoded.payload.id);
    }

};
