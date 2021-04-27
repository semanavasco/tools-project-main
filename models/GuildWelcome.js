const mongoose = require('mongoose');
const { mongo_WELCOME } = require('../config.js');

const conn = new mongoose.createConnection(mongo_WELCOME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const schema = new mongoose.Schema({
    name: String,
    guildID: String,
    onoff: Boolean,
    channel: String,
    embed: {
        activate: Boolean,
        title: String,
        thumbnail: String,
        description: String,
        color: String,
        date: Boolean,
        image: String,
        footer: String
    },
    image: {
        activate: Boolean,
        image: String
    },
    texte: String
});

const welcomeSchema = conn.model('GuildWelcome', schema);

module.exports = welcomeSchema;