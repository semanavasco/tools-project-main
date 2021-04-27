const Discord = require('discord.js');
const GuildOptions = require('../../models/GuildOptions.js');
const GuildLogs = require('../../models/GuildLogs.js');
const LevelingMessage = require('../../models/LevelingMessage.js');

module.exports = {
    name: 'guildoptions',
    description: 'Affiche les paramètres actuels du serveur.',
    usage: '',
    guildOnly: true,
    cooldown: 5,
    permissions: 'MANAGE_GUILD',
    async execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        GuildOptions.findOne({
            guildID: message.guild.id
        }, async (err, data) => {
            if (err) console.log(err);

            let AntiLink = false;
            let AntiInsults = false;
            let AntiSpam = false;

            AntiSpam = data.AntiSpam;
            AntiInsults = data.AntiInsults;
            AntiLink = data.AntiLink;

            GuildLogs.findOne({
                guildID: message.guild.id
            }, async (err, data) => {
                if (err) console.log(err);
                let logsChannel = '';
                let userLogs = false;
                let guildLogs = false;

                if (!data.logsChannel) return;
                else if (data.logsChannel === '') return;
                else logsChannel = data.logsChannel;

                userLogs = data.userLogs;
                guildLogs = data.guildLogs;

                LevelingMessage.findOne({
                    guildID: message.guild.id
                }, async (err, data) => {
                    if (err) console.log(err);

                    let levelOnOff = false;
                    let levelMessage = false;
                    let levelChannel = false;

                    levelOnOff = data.onoff;
                    levelMessage = data.messageActivate;
                    levelChannel = data.channelActivate;

                    const statuses = {
                        true: "Activé",
                        false: "Désactivé"
                    }

                    const definition = {
                        true: "Personnalisé",
                        false: "Par défaut"
                    }

                    const emojis = {
                        true: "<:icone_rejoint:824290384250667079>",
                        false: "<:icone_leave:824344549245059102>"
                    }

                    let emojiModLogs = '';

                    if (!logsChannel || logsChannel === '') {
                        emojiModLogs = '<:icone_leave:824344549245059102>';
                    } else {
                        emojiModLogs = '<:icone_rejoint:824290384250667079>';
                    }

                    let statusModLogs = '';

                    if (!logsChannel || logsChannel === '') {
                        statusModLogs = 'Aucun';
                    } else {
                        statusModLogs = logsChannel;
                    }

                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription(`**Status du serveur : ${message.guild.name} (\`${message.guild.id}\`)**`)
                        .addField(`Anti-Link`, `${emojis[AntiLink]} - \`${statuses[AntiLink]}\``, true)
                        .addField(`Anti-Spam`, `${emojis[AntiSpam]} - \`${statuses[AntiSpam]}\``, true)
                        .addField(`Anti-Insultes`, `${emojis[AntiInsults]} - \`${statuses[AntiInsults]}\``, true)
                        .addField(`Salon des Logs`, `${emojiModLogs} - <#${statusModLogs}>`, true)
                        .addField(`Logs-Serveur`, `${emojis[guildLogs]} - \`${statuses[guildLogs]}\``, true)
                        .addField(`Logs-Utilisateur`, `${emojis[userLogs]} - \`${statuses[userLogs]}\``, true)
                        .addField(`Niveaux`, `${emojis[levelOnOff]} - \`${statuses[levelOnOff]}\``, true)
                        .addField(`Message Custom`, `${emojis[levelMessage]} - \`${definition[levelMessage]}\``, true)
                        .addField(`Salon Custom`, `${emojis[levelChannel]} - \`${definition[levelChannel]}\``, true)
                        .setThumbnail(message.guild.iconURL({ format: "png", dynamic: true }))
                        .setColor(roleColor)
                        .setFooter(`Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }))
                    );
                });
            });
        });
    },
};