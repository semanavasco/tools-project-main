const Discord = require('discord.js');
const Levels = require('discord-xp');
const canvacord = require('canvacord');
const LevelingMessage = require('../../models/LevelingMessage.js');

module.exports = {
    name: 'rank',
    description: 'Envoie ton niveau actuel ou celui de la personne mentionnée sur le serveur !',
    usage: '{utilisateur}',
    guildOnly: true,
    cooldown: 5,
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
                const target = message.mentions.users.first() || message.guild.members.cache.find(user => user.id === args[0]) || message.author;
                const user = await Levels.fetch(target.id, message.guild.id);
                const neededXp = Levels.xpFor(parseInt(user.level) + 1);

                if (!user) return message.channel.send(Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Tu n'as pas encore reçu d'xp, essaye d'envoyer quelques messages !`)
                    .setColor('d10000')
                );

                const rank = new canvacord.Rank()
                    .setAvatar(target.displayAvatarURL({ format: "png", dynamic: false }))
                    .setCurrentXP(user.xp)
                    .setLevel(parseInt(user.level))
                    .setRank(user.level, message.author.username, false)
                    .setRequiredXP(neededXp)
                    .setStatus(target.presence.status)
                    .setProgressBar(`#23272A`, "COLOR")
                    .setUsername(target.username)
                    .setDiscriminator(target.discriminator);

                rank.build()
                    .then(data => {
                        const attachment = new Discord.MessageAttachment(data, `${target.id}_rankcard.png`);
                        message.channel.send(attachment);
                    });
            }
        });
    },
};