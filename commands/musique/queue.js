const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'queue',
    description: 'Active ou désactive le loop.',
    usage: '',
    guildOnly: false,
    cooldown: 5,
    execute(client, message, args) {
        if (!message.member.voice.channel) {
            return message.channel.send(new MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Vous devez être dans un \`salon vocal\` pour effectuer cette commande.`)
                .setColor('d10000')
            );
        }
        else if (message.member.voice.channel.id !== client.member.voice.channel.id) {
            return message.channel.send(new MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Vous devez être dans le \`même salon vocal que le bot\` pour effectuer cette commande.`)
                .setColor('d10000')
            );
        }
        else {
            const queue = client.distube.getQueue(message)
            if (!queue) {
                message.channel.send(new MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas trouvé de musique \`en cours de lecture\`.`)
                    .setColor('d10000')
                );
            }

            const q = queue.songs.map((song, i) => `${i === 0 ? "Playing:" : `${i}.`} **${song.name}** - \`${song.formattedDuration}\``).join("\n")
            const target = message.guild.members.cache.get(message.author.id);
            const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

            message.channel.send(new MessageEmbed()
                .setTitle(`Liste des Musiques :`)
                .setDescription(`${q}`)
                .setColor(roleColor)
            );
        }
    },
};