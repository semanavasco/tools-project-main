const mongoose = require('mongoose');
const { mongo_GUILDSTATUS } = require('../config.js');

const conn = new mongoose.createConnection(mongo_GUILDSTATUS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const schema = new mongoose.Schema({
    name: String,
    guildID: String,
    onoff: Boolean,
    role: String,
    status: String
});

const statusSchema = conn.model('GuildStatus', schema);

module.exports = statusSchema;