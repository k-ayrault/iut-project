'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class UserService extends Service {

    create(user) {

        const { User } = this.server.models();

        return User.query().insertAndFetch(user);
    }

    delete(user) {
        const { User } = this.server.models();

        return User.query().deleteById(user.id);
    }

    update(id, user) {
        const { User } = this.server.models();

        return User.query().updateAndFetchById(id.id, user);
    }
};
