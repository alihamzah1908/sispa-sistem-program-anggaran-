const mysql = require('mysql')
const config = require('../config/config_db');
const rekening = require('../models/rekening')
const model = require('../models/index')
const pool = mysql.createPool(config);

pool.on('error', (err) => {
    console.error(err);
});

exports.Rekening = (req, res) => {
    pool.getConnection(function(err, conn) {
        if (req.query.rekening_id) {
            rekening.rekening.findAll({
                include: [
                    { model: model.users.users }
                ],
                where: {
                    id: req.query.rekening_id,
                    userId: req.session.userid
                }
            }).then(rekenings => {
                if (rekenings < 0) {
                    res.status(400).send('Error, data not found !');
                } else {
                    res.json(rekenings)
                }
            })
        } else {
            if (req.session.role == 'super admin') {
                rekening.rekening.findAll({
                    include: [
                        { model: model.users.users }
                    ],
                }).then(rekenings => {
                    if (rekenings < 0) {
                        res.status(400).send('Error, data not found !');
                    } else {
                        res.json(rekenings)
                    }
                })
            } else {
                rekening.rekening.findAll({
                    include: [
                        { model: model.users.users }
                    ],
                    where: {
                        userId: req.session.userid
                    }
                }).then(rekenings => {
                    if (rekenings < 0) {
                        res.status(400).send('Error, data not found !');
                    } else {
                        res.json(rekenings)
                    }
                })
            }
        }
    })
}

exports.getRekeningById = (req, res) => {
    pool.getConnection(function(err, conn) {
        rekening.rekening.findAll({
            where: {
                id: req.query.id
            }
        }).then(rekenings => {
            if (rekenings < 0) {
                res.status(400).send('Error, data not found !');
            } else {
                res.json(rekenings)
            }
        })
    })
}

exports.tambah_rekening = (req, res) => {
    pool.getConnection(function(err, conn) {
        if (req.body.id) {
            rekening.rekening.update({
                sub_kegiatan: req.body.sub_kegiatan,
                saldo: req.body.saldo,
            }, {
                where: {
                    id: req.body.id
                }
            }).then(rekenings => {
                if (rekenings) {
                    res.redirect('/sub_kegiatan')
                } else {
                    res.status(400).send('Error in insert new record');
                }
            })
        } else {
            rekening.rekening.create({
                userId: req.session.userid,
                kode_rekening: req.body.rekening,
                sub_kegiatan: req.body.sub_kegiatan,
                saldo: req.body.saldo,
            }).then(rekenings => {
                if (rekenings) {
                    res.redirect('/sub_kegiatan')
                } else {
                    res.status(400).send('Error in insert new record');
                }
            })
        }

    })
}

exports.deleteRekening = (req, res) => {
    pool.getConnection(function(err, conn) {
        rekening.rekening.destroy({
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