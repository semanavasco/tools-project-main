const translate = require('@iamtraction/google-translate');
const Discord = require('discord.js');
const nekoclient = require('nekos.life');
const neko = new nekoclient();

module.exports = {
    name: 'fact',
    description: 'Le savais-tu ?',
    usage: '',
    guildOnly: false,
    aliases: ['lesavaistu', 'lst'],
    cooldown: 5,
    async execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        const factTEXT = await neko.sfw.fact();
        const fact = factTEXT.fact;

        let desc = '';
        await translate(`${fact}`, { from: 'en', to: 'fr' }).then(res => {
            desc += `${res.text}`
        }).catch(err => {
            console.error(err);
        });

        message.channel.send(new Discord.MessageEmbed()
            .setDescription(`**Le savais-tu ?**\n\n> *\`${desc}\`*\n\u200b`)
            .setColor(roleColor)
            .setFooter(`Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }))
            .setTimestamp()
        );
    }
}