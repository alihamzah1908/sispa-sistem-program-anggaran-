const sxs = require('../config/config_db')
const Sequelize = require('sequelize');
const rekening = require('./rekening')
const users = require('./users')
const cashflow = sxs.sequelize.define('cashflow', {
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
        'rekeningId': {
            type: Sequelize.INTEGER,
            references: {
                model: rekening.rekening, // 'Movies' would also work
                key: 'id',
            },
        },
        'kode_rekening': Sequelize.STRING,
        'uraian': Sequelize.STRING,
        'koefisien': Sequelize.STRING,
        'satuan': Sequelize.STRING,
        'harga': Sequelize.STRING,
        'ppn': Sequelize.STRING,
        'total': Sequelize.STRING,
        'date': Sequelize.STRING,
        'createdAt': {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    }, {
        //prevent sequelize transform table name into plural
        freezeTableName: true,
    })
    // cashflow.sync({ force: true }).then(() => {
    //     console.log("Drop and re-sync db.");
    // });
cashflow.belongsTo(users.users);
cashflow.belongsTo(rekening.rekening);
module.exports = {
    cashflow
}