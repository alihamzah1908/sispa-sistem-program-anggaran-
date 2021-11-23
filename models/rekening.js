const sxs = require('../config/config_db')
const Sequelize = require('sequelize');
const users = require('./users')
var rekening = sxs.sequelize.define('rekening', {
    'id': {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'userId': {
        type: Sequelize.INTEGER,
        references: {
            model: 'users', // 'Movies' would also work
            key: 'id',
        },
    },
    'kode_rekening': Sequelize.STRING,
    'sub_kegiatan': Sequelize.STRING,
    'saldo': Sequelize.STRING,
    'createdAt': {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    //prevent sequelize transform table name into plural
    freezeTableName: true,
    timestamp: false
});
rekening.belongsTo(users.users);
// rekening.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
// });
module.exports = {
    rekening
}