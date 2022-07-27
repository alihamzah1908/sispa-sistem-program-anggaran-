const express = require('express')
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const oneDay = 1000 * 60 * 60 * 24;

global.__basedir = __dirname + "/";
app.use(express.static(__dirname + "/public"));
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));
app.engine('hbs', exphbs({
    defaultLayout: 'default',
    extname: '.hbs',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
const PORT = process.env.PORT || 8000;
require("./routes/routes.js")(app);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});