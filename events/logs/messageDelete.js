const Discord = require('discord.js');
const GuildLogs = require('../../models/GuildLogs.js');

module.exports = async (client, message) => {
    if (message.author.bot) return;
    client.snipes.set(message.channel.id, {
        content: message.content,
        author: message.author.tag,
        member: message.member,
        id: message.author.id,
        image: message.attachments.first() ? message.attachments.first().proxyURL : null
    });

    GuildLogs.findOne({
        guildID: message.guild.id
    }, async (err, data) => {
        if (err) console.log(err);
        let logsChannel = '';
        let guildLogs = false;

        if (!data) {
            const newData = new GuildLogs({
                name: message.guild.name,
                guildID: message.guild.id,
                logsChannel: '',
                guildLogs: false,
                userLogs: false
            });
            newData.save().catch(err => console.log(err));

            logsChannel = '';
        }
        else {
            logsChannel = data.logsChannel;
            guildLogs = data.guildLogs;
        }

        if (!logsChannel || logsChannel === '') return;

        let embed = new Discord.MessageEmbed()
            .setTitle(`<:icone_indisponible:824290381222117396> | Message Supprimé !`)
            .setDescription(`Un message de l'utilisateur **${message.author} (\`${message.author.id}\`)** a été supprimé dans le salon **<#${message.channel.id}>** !`)
            .addField(`Contenu du Message`, message.content, true)
            .setColor('d10000')
            .setTimestamp()
            .setFooter(message.author.username, message.author.displayAvatarURL({ format: "png", dynamic: true }))

        let channel = message.guild.channels.cache.find(
            (ch) => ch.id === logsChannel
        );
        if (!channel) return;
        if (guildLogs === false) return;
        channel.send(embed);
    });
}