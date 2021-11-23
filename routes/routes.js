module.exports = app => {
    const router = require("express").Router();
    const Dashboard = require('../controllers/dashboard')
    const Users = require('../controllers/users')
    const Auth = require('../controllers/auth')
    const rekening = require('../controllers/rekening')
    const Cashflow = require('../controllers/cashflow')

    router.get('/', (req, res) => { res.sendFile(__basedir + '/views/login.html') });
    router.post('/login', Auth.Login);
    router.get('/logout', Auth.Logout);
    router.get('/dashboard', (req, res) => {
        if (req.session.loggedin) {
            res.render('dashboard', {
                logusername: req.session.name,
                username: req.session.username,
                userid: req.session.userid
            })
        } else {
            res.redirect('/')
        }
    });
    router.get('/report', (req, res) => {
        res.render('report', {
            logusername: req.session.name,
            username: req.session.username,
            userid: req.session.userid
        })
    });
    router.get('/employee', Dashboard.employee);
    router.get('/data_report', Dashboard.report);

    // Users 
    router.get('/users', (req, res) => {
        if (req.session.loggedin) {
            res.render('users/index', {
                logusername: req.session.name,
                username: req.session.username,
                userid: req.session.userid
            })
        } else {
            res.redirect('/')
        }
    });
    router.get('/data_users', Users.User)
    router.get('/delete_users', Users.deleteUser)
    router.post('/tambah_users', Users.postUser);

    // Rekening
    router.get('/sub_kegiatan', (req, res) => {
        if (req.session.loggedin) {
            res.render('rekening/index', {
                logusername: req.session.name,
                username: req.session.username,
                userid: req.session.userid
            })
        } else {
            res.redirect('/')
        }
    });
    router.post('/tambah_rekening', rekening.tambah_rekening);
    router.get('/data_rekening', rekening.Rekening);
    router.get('/rekening_by_id', rekening.getRekeningById);
    router.get('/delete_rekening', rekening.deleteRekening);

    // Cashflow
    router.get('/cashflow', (req, res) => {
        if (req.session.loggedin) {
            res.render('cashflow/index', {
                logusername: req.session.name,
                username: req.session.username,
                userid: req.session.userid
            })
        } else {
            res.redirect('/')
        }
    });
    router.post('/tambah_cash', Cashflow.tambah_cashflow);
    router.get('/data_cash', Cashflow.cashflow);
    router.get('/download_report', Cashflow.exportCashflow);
    router.get('/cashflow_by_id', Cashflow.cashflowById);
    router.get('/delete_cashflow', Cashflow.deleteCashflow);

    app.use('/', router);
}