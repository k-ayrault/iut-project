'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class UserService extends Service {

    create(user) {

        const { User } = this.server.models();

        return User.query().insertAndFetch(user);
    }

    getUser(user) {
        const { User } = this.server.models();
        return User.query().findOne({
            id: user.id
        });
    }

    getMailsUser() {

        const { User } = this.server.models();
        console.log(User.query());
    }

    delete(user) {
        const { User } = this.server.models();

        return User.query().deleteById(user.id);
    }

    update(id, user) {
        const { User } = this.server.models();

        return User.query().updateAndFetchById(id.id, user);
    }

    login(user) {
        const { User } = this.server.models();

        return User.query().findOne({
            mail: user.mail,
            password: user.password
        });
    }
};
