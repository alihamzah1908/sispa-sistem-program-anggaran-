const mysql = require('mysql')
const config = require('../config/config_db');
const users = require('../models/users')
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const pool = mysql.createPool(config);

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: tutorials } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, tutorials, totalPages, currentPage };
};

pool.on('error', (err) => {
    console.error(err);
});

exports.User = (req, res) => {
    const { page, size, title } = req.query;
    const { limit, offset } = getPagination(page, size);
    pool.getConnection(function(err, conn) {
        if (req.query.username) {
            users.users.findAll({
                where: {
                    username: req.query.username,
                }
            }).then(user => {
                if (user < 0) {
                    console.log('data not found')
                } else {
                    res.json(user)
                }
            })
        } else {
            if (req.query.id) {
                users.users.findAll({
                    where: {
                        role_user: 'admin',
                        id: req.query.id
                    },
                }).then(user => {
                    if (user < 0) {
                        console.log('data not found')
                    } else {
                        res.json(user)
                    }
                })
            } else {
                users.users.findAll({
                    where: {
                        role_user: 'admin',
                    },
                }).then(user => {
                    if (user < 0) {
                        console.log('data not found')
                    } else {
                        res.json(user)
                    }
                })
            }
        }
    })
}

exports.postUser = (req, res) => {
    pool.getConnection(function(err, conn) {
        if (req.body.id) {
            users.users.update({
                name: req.body.fullname,
                username: req.body.username,
                role_user: req.body.role_user,
            }, {
                where: {
                    id: req.body.id
                }
            }).then(user => {
                if (user) {
                    res.redirect('/users')
                } else {
                    res.status(400).send('Error in insert new record');
                }
            })
        } else {
            users.users.create({
                name: req.body.fullname,
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, salt),
                role_user: req.body.role_user,
            }).then(user => {
                if (user) {
                    res.redirect('/users')
                } else {
                    res.status(400).send('Error in insert new record');
                }
            })
        }
    })
}

exports.deleteUser = (req, res) => {
    pool.getConnection(function(err, conn) {
        users.users.destroy({
            where: {
                id: req.query.id
            }
        }).then(user => {
            if (user) {
                res.json({
                    'status': 200,
                    'information': 'sukses delete data'
                })
            } else {
                res.json({
                    'status': 400,
                    'information': 'gagal delete data'
                })
            }
        })
    })
}