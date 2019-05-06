const db = require("../dbConfig.js");

module.exports = {
    get,
    getPost,
    getPostByUser,
    add,
    update,
    remove,
    removeByUser,
};

function get() {
    return db("posts");
}

function getPost(id) {
    return db("posts")
        .select(
            "id",
            "users_id"
        )
        .where("id", id);
}

function getPostComment(id) {
    return db("comments")
        .select("comment")
        .where("posts_id", id);
}

function getPostByUser(userId) {
    return db("posts")
        .select(
            "id",
            ""
        )
        .where("users_id", userId);
}

function add(post) {
    return db("posts")
        .insert(post)
        .returning("id")
}

function update(id, changes) {
    return db("posts")
        .where({ id })
        .update(changes);
}

function remove(id) {
    return db("posts")
        .where("id", id)
        .del();
}

function removeByUser(user_id) {
    return db("posts")
        .where("user_id", user_id)
        .del();
}