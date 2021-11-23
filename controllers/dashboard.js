const mysql = require('mysql')
const config = require('../config/config_db');
const presence = require('../models/rekening')
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
const pool = mysql.createPool(config);

pool.on('error', (err) => {
    console.error(err);
});

exports.employee = (req, res) => {
    pool.getConnection(function(err, conn) {
        if (req.session.role == 'super admin') {
            presence.presence.findAll().then(present => {
                if (present < 0) {
                    res.status(400).send('Data not found');
                } else {
                    res.json(present)
                }
            })
        } else {
            presence.presence.findAll({
                where: {
                    createdBy: req.session.userid
                }
            }).then(present => {
                if (present < 0) {
                    res.status(400).send('Data not found');
                } else {
                    res.json(present)
                }
            })
        }
    })
}

exports.report = (req, res) => {
    pool.getConnection(function(err, conn) {
        if (req.session.role == 'super admin') {
            if (req.query.presence) {
                switch (req.query.presence) {
                    case 'present':
                        absent = "present";
                        break;
                    case 'not present':
                        absent = "not present";
                        break;
                    default:
                        absent = '';
                }
                presence.presence.findAll({
                    where: {
                        presence: absent
                    },
                }).then(present => {
                    if (present < 0) {
                        res.status(400).send('Data not found');
                    } else {
                        res.json(present)
                    }
                })
            } else {
                if (req.query.start_date || req.query.end_date) {
                    let startDate = req.query.start_date
                    let endDate = req.query.end_date
                    presence.presence.findAll({
                        where: {
                            date: {
                                [Op.between]: [startDate, endDate]
                            }
                        }
                    }).then(present => {
                        if (present < 0) {
                            res.status(400).send('Data not found');
                        } else {
                            res.json(present)
                        }
                    })
                } else {
                    var today = new Date();
                    var dateNow = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                    presence.presence.findAll({
                        where: {
                            date: dateNow
                        }
                    }).then(present => {
                        if (present < 0) {
                            res.status(400).send('Data not found');
                        } else {
                            res.json(present)
                        }
                    })
                }
            }
        } else {
            presence.presence.findAll({
                where: {
                    createdBy: req.session.userid
                }
            }).then(present => {
                if (present < 0) {
                    res.status(400).send('Data not found');
                } else {
                    res.json(present)
                }
            })
        }
    })
}