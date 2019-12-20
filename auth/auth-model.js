const db = require('../database/dbConfig');

module.exports = {
    add,
    findBy
}


function add(user) {
    return db('users')
        .insert(user, 'id')
        .then(ids => {
            const [id] = ids;
            return db('users')
                .where({ id })
                .first();
        })
}

function findBy(username) {
    return db('users')
        .where(username)
        .first();
}