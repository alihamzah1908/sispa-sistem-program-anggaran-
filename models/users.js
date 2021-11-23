const sxs = require('../config/config_db')
const Sequelize = require('sequelize');
const rekening = require('./rekening')
const users = sxs.sequelize.define('users', {
        'name': Sequelize.STRING,
        'username': Sequelize.STRING,
        'password': Sequelize.STRING,
        'role_user': Sequelize.STRING,
        'createdAt': {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        'updatedAt': {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    }, {
        //prevent sequelize transform table name into plural
        freezeTableName: true,
    })
    // users.sync({ force: true }).then(() => {
    //     console.log("Drop and re-sync db.");
    // });
module.exports = {
    users
}