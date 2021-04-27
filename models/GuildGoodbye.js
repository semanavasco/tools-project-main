const mongoose = require('mongoose');
const { mongo_GOODBYE } = require('../config.js');

const conn = new mongoose.createConnection(mongo_GOODBYE, {
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

const goodbyeSchema = conn.model('GuildGoodbye', schema);

module.exports = goodbyeSchema;