const dbPool = require("../../config/knex");

const userModel = {
  createUser: ({ username, email, password }) =>
    dbPool("users").insert({
      id_user: dbPool.raw("uuid()"), // Generate UUID di sisi database
      username,
      email,
      password,
      roles: "viewer", // Default role
    }),

  updateUser: (id_user, data) => {
    return dbPool("users").where({ id_user }).update(data);
  },

  deleteUser: (id_user) => {
    return dbPool("users").where({ id_user }).del();
  },

  getUser: (filters = {}) => {
    const { email, username, id_user } = filters;
    return dbPool("users")
      .select("*")
      .modify((query) => {
        if (email) query.where({ email });
        if (username) query.where({ username });
        if (id_user) query.where({ id_user });
      });
  },

  getTotalUser: () => {
    return dbPool("users")
      .select("roles")
      .count("* as total_users")
      .groupBy("roles");
  },
};

module.exports = userModel;
