const Discord = require('discord.js');
const Levels = require('discord-xp');
const LevelingMessage = require('../../models/LevelingMessage.js');

module.exports = {
    name: 'levels',
    description: 'Envoie la leaderboard du serveur !',
    usage: '',
    guildOnly: true,
    cooldown: 5,
    aliases: ['lb', 'leaderboard'],
    async execute(client, message, args) {
        LevelingMessage.findOne({
            guildID: message.guild.id
        }, async (err, data) => {
            if (err) console.log(err);
            let onoff = false;

            if (!data) {
                const newData = new LevelingMessage({
                    name: message.guild.name,
                    guildID: message.guild.id,
                    onoff: false,
                    messageActivate: false,
                    message: '',
                    channelActivate: false,
                    channel: ''
                })
                newData.save().catch(err => console.log(err));
            }

            onoff = data.onoff;

            if (onoff === false) {
                return message.channel.send(new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Le système d'XP est désactivé pour ce serveur.`)
                    .setColor('d10000')
                ).then(sent => sent.delete({ timeout: 5e3 }));
            }
            else {
                const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10);
                if (rawLeaderboard.length < 1) return message.channel.send(new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Personne n'est encore présent dans la leaderboard !`)
                    .setColor('d10000')
                );

                const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true);
                const lb = leaderboard.map(e => `**${e.position} -** <@${e.userID}> - Level : **${e.level}** - XP : **${e.xp.toLocaleString()}**`)
                const target = message.guild.members.cache.get(message.author.id);
                const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

                message.channel.send(new Discord.MessageEmbed()
                    .setDescription(`*Position | Level | Total d'XP*\n\n${lb.join("\n\n")}`)
                    .setColor(roleColor)
                    .setFooter(`Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }))
                    .setTimestamp()
                    .setThumbnail(message.guild.iconURL({ format: "png", dynamic: true }))
                );
            }
        });
    },
};