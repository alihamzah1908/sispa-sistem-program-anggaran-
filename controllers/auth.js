const mysql = require('mysql')
const config = require('../config/config_db');
const users = require('../models/users')
const bcrypt = require('bcrypt')
const pool = mysql.createPool(config);

pool.on('error', (err) => {
    console.error(err);
});

exports.Login = (req, res) => {
    pool.getConnection(function(err, conn) {
        var username = req.body.username;
        var password = req.body.password;
        if (username && password) {
            users.users.findAll({
                where: {
                    username: username
                }
            }).then(user => {
                if (user.length > 0) {
                    const check = bcrypt.compareSync(password, user[0].password)
                    if (check == true) {
                        req.session.loggedin = true;
                        req.session.name = user[0].name;
                        req.session.username = user[0].username;
                        req.session.userid = user[0].id;
                        req.session.role = user[0].role_user;
                        res.redirect('/dashboard')
                    } else {
                        res.redirect('/');
                    }
                } else {
                    res.send('username and password is wrong')
                }
            })
        } else {
            res.send('Please enter Username and Password!');
            res.end();
        }
    })
}

exports.Logout = (req, res) => {
    pool.getConnection(function(err, conn) {
        req.session.destroy(function(err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/');
            }
        });
    })
}