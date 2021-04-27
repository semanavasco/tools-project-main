const mongoose = require('mongoose');
const { mongo_LEVELINGMESSAGES } = require('../config.js');

const conn = new mongoose.createConnection(mongo_LEVELINGMESSAGES, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const schema = new mongoose.Schema({
    name: String,
    guildID: String,
    onoff: Boolean,
    messageActivate: Boolean,
    message: String,
    channelActivate: Boolean,
    channel: String
});

const levelingSchema = conn.model('LevelingMessage', schema);

module.exports = levelingSchema;