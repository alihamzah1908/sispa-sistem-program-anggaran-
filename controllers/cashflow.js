const mysql = require('mysql')
const config = require('../config/config_db');
const model = require('../models/index');
const cashflow = require('../models/cashflow')
const rekening = require('../models/rekening')
const exceljs = require('exceljs')
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
const pool = mysql.createPool(config);

pool.on('error', (err) => {
    console.error(err);
});


exports.cashflow = (req, res) => {
    pool.getConnection(function(err, conn) {
        if (req.query.start_date || req.query.end_date) {
            var startDate = req.query.start_date
            var endDate = req.query.end_date
        } else {
            var today = new Date();
            var startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            var endDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        }
        if (req.session.role == 'super admin') {
            cashflow.cashflow.findAll({
                include: [{
                    model: model.users.users,
                    as: 'user'
                }, {
                    model: model.rekening.rekening,
                    as: 'rekening'
                }],
                where: {
                    date: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            }).then(cash => {
                if (cash < 0) {
                    res.status(400).send('Error, data not found !');
                } else {
                    res.json(cash)
                }
            })
        } else {
            cashflow.cashflow.findAll({
                include: [{
                    model: model.users.users,
                    as: 'user'
                }, {
                    model: model.rekening.rekening,
                    as: 'rekening'
                }],
                where: {
                    userId: req.session.userid,
                    date: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            }).then(cash => {
                if (cash < 0) {
                    res.status(400).send('Error, data not found !');
                } else {
                    res.json(cash)
                }
            })
        }
    })
}

exports.tambah_cashflow = (req, res) => {
    pool.getConnection(function(err, conn) {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        if (req.body.id) {
            var data = cashflow.cashflow.update({
                userId: req.session.userid,
                rekeningId: req.body.sub_kegiatan_id,
                kode_rekening: req.body.kode_rekening,
                uraian: req.body.uraian,
                koefisien: req.body.koefisien,
                satuan: req.body.satuan,
                harga: req.body.harga,
                ppn: req.body.ppn,
                total: req.body.total
            }, {
                where: {
                    id: req.body.id
                }
            })
            if (req.body.total_awal != req.body.total) {
                rekening.rekening.update({
                    saldo: (req.body.saldo - req.body.total),
                }, {
                    where: {
                        id: req.body.sub_kegiatan_id
                    }
                }).then(cash => {
                    if (cash) {
                        res.redirect('/cashflow')
                    } else {
                        res.status(400).send('Error in insert new record');
                    }
                })
            }
        } else {
            var data = cashflow.cashflow.create({
                userId: req.session.userid,
                rekeningId: req.body.sub_kegiatan_id,
                kode_rekening: req.body.kode_rekening,
                uraian: req.body.uraian,
                koefisien: req.body.koefisien,
                satuan: req.body.satuan,
                harga: req.body.harga,
                ppn: req.body.ppn,
                total: req.body.total,
                date: date
            })
            rekening.rekening.update({
                saldo: (req.body.saldo - req.body.total),
            }, {
                where: {
                    id: req.body.sub_kegiatan_id
                }
            }).then(cash => {
                if (cash) {
                    res.redirect('/cashflow')
                } else {
                    res.status(400).send('Error in insert new record');
                }
            })
        }
        data.then(cash => {
            if (cash) {
                res.json({
                    'status': 200,
                    'data': cash
                })
            } else {
                res.status(400).send('Error in insert new record');
            }
        })
    })
}

exports.exportCashflow = (req, res) => {
    if (req.query.start_date || req.query.end_date) {
        var startDate = req.query.start_date
        var endDate = req.query.end_date
    } else {
        var today = new Date();
        var startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        var endDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    }
    pool.getConnection(function(err, conn) {
        if (req.session.role == 'super admin') {
            var condition = {
                date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        } else {
            var condition = {
                date: {
                    [Op.between]: [startDate, endDate]
                },
                userId: req.session.userid
            }
        }
        cashflow.cashflow.findAll({
            include: [{
                model: model.users.users,
                as: 'user'
            }, {
                model: model.rekening.rekening,
                as: 'rekening'
            }],
            where: condition
        }).then(objs => {
            let arr = [];
            objs.forEach((obj) => {
                arr.push({
                    id: obj.id,
                    name: obj.user.name,
                    sub_kegiatan: obj.rekening.sub_kegiatan,
                    kode_rekening: obj.kode_rekening,
                    uraian: obj.uraian,
                    koefisien: obj.koefisien,
                    satuan: obj.satuan,
                    harga: obj.harga,
                    total: obj.total,
                });
            });
            const workbook = new exceljs.Workbook();
            const worksheet = workbook.addWorksheet('Presence employeee')
            worksheet.columns = [
                { header: 'No', key: 'id', width: 10 },
                { header: 'Nama Pemilik', key: 'name', width: 20 },
                { header: 'Sub Kegiatan', key: 'sub_kegiatan', width: 20 },
                { header: 'Kode Rekening', key: 'kode_rekening', width: 20 },
                { header: 'Uraian', key: 'uraian', width: 20 },
                { header: 'Koefisien', key: 'koefisien', width: 20 },
                { header: 'Satuan', key: 'satuan', width: 20 },
                { header: 'Harga ', key: 'harga', width: 20 },
                { header: 'Total ', key: 'total', width: 20 },
            ]
            worksheet.addRows(arr);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "cashflow.xlsx"
            );
            worksheet.getRow(1).eachCell((cell) => { cell.font = { bold: true }; });
            // Making first line in excel bold
            return workbook.xlsx.write(res).then(function() {
                res.status(200).end();
            });
        })
    })
}

exports.cashflowById = (req, res) => {
    pool.getConnection(function(err, conn) {
        cashflow.cashflow.findAll({
            include: [{
                model: model.rekening.rekening,
                as: 'rekening'
            }],
            where: {
                id: req.query.id
            }
        }).then(cash => {
            if (cash < 0) {
                res.status(400).send('Error, data not found !');
            } else {
                res.json(cash)
            }
        })
    })
}

exports.deleteCashflow = (req, res) => {
    pool.getConnection(function(err, conn) {
        console.log(req.query)
        cashflow.cashflow.destroy({
            where: {
                id: req.query.id
            }
        }).then(cash => {
            if (cash) {
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

        // update saldo after delete  
        rekening.rekening.update({
            saldo: parseFloat(req.query.saldo) + parseFloat(req.query.total),
        }, {
            where: {
                id: req.query.sub_kegiatan_id
            }
        }).then(cash => {
            if (cash) {
                res.redirect('/cashflow')
            } else {
                res.status(400).send('Error in insert new record');
            }
        })
    })
}