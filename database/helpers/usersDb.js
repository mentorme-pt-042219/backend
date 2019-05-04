const db = require("../dbConfig");

module.exports = {
    get,
    getBy,
    getById,
    getUserPosts,
    add,
    update,
    remove,
};

function get() {
    return db("users");
}

function getBy(filter) {
    return db("users")
    .where(filter);
}

function getById(id) {
    return db("users")
        .select("id", "username")
        .where({ id })
        .first();
}

function getUserPosts(username) {
    return db("posts as p")
        .join("users as u", "u.username", "p.users_username")
        .select("p.id", "p.text", "u.username as postedBy")
        .where("p.users_username", username);
}

// CREATE NEW USER
function add(saved) {
    const [id] = db("users")
        .insert(saved);

    return getById(id);
}

function update(id, change) {
    return db("users")
        .where("id", id)
        .update(change);
}

function remove(id) {
    return db("users")
        .where("id", id )
        .del();
}