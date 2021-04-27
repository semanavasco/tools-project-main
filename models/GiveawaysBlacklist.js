const mongoose = require('mongoose');
const { mongo_GIVEAWAYSBLACKLIST } = require('../config.js');

const conn = new mongoose.createConnection(mongo_GIVEAWAYSBLACKLIST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const schema = new mongoose.Schema({
    guildNAME: String,
    guildID: String,
    userNAME: String,
    userID: String,
    blacklisted: Boolean
});

const blacklistSchema = conn.model('GiveawaysBlacklist', schema);

module.exports = blacklistSchema;