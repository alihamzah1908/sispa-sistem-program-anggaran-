const cashflow = require('./cashflow')
const rekening = require('./rekening')
const users = require('./users')

const model = {};

model.users = users;
model.rekening = rekening;
model.cashflow = cashflow;

module.exports = model;