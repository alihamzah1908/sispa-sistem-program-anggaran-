const Sequelize = require('sequelize');

const sequelize = new Sequelize('sireda', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 1000
    }
})

module.exports = {
    sequelize
}