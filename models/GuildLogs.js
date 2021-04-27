const mongoose = require('mongoose');
const { mongo_GUILDLOGS } = require('../config.js');

const conn = new mongoose.createConnection(mongo_GUILDLOGS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const schema = new mongoose.Schema({
    name: String,
    guildID: String,
    logsChannel: String,
    guildLogs: Boolean,
    userLogs: Boolean
});

const guildSchema = conn.model('GuildOptions', schema);

module.exports = guildSchema;