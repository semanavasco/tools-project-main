const mongoose = require('mongoose');
const { mongo_LOVECALC } = require('../config.js');

const conn = new mongoose.createConnection(mongo_LOVECALC, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const schema = new mongoose.Schema({
    name: String,
    guildID: String,
    user1Name: String,
    user1ID: String,
    user2Name: String,
    user2ID: String,
    percent: String
});

const lovecalcSchema = conn.model('LoveCalc', schema);

module.exports = lovecalcSchema;