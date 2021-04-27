const mongoose = require('mongoose');
const { mongo_GUILDOPTIONS } = require('../config.js');

const conn = new mongoose.createConnection(mongo_GUILDOPTIONS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const schema = new mongoose.Schema({
    name: String,
    guildID: String,
    prefix: String,
    AntiLink: Boolean,
    AntiSpam: Boolean,
    AntiInsults: Boolean
});

const guildSchema = conn.model('GuildOptions', schema);

module.exports = guildSchema;