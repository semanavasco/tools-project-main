const Discord = require('discord.js');
const nekoclient = require('nekos.life');
const neko = new nekoclient();

module.exports = {
    name: 'cattext',
    description: 'Envoie un texte random de chats !',
    usage: '',
    guildOnly: false,
    cooldown: 5,
    async execute(client, message, args) {
        const catTEXT = await neko.sfw.catText();
        message.channel.send(catTEXT.cat);
    }
}