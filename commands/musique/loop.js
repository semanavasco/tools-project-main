const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'loop',
    description: 'Active ou désactive le loop.',
    usage: '<off/song/queue>',
    aliases: ["repeat", "l"],
    guildOnly: false,
    args: true,
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

            let mode = null
            switch (args[0]) {
                case "off":
                    mode = 0
                    break
                case "song":
                    mode = 1
                    break
                case "queue":
                    mode = 2
                    break
            }
            mode = client.distube.setRepeatMode(message, mode)
            mode = mode ? mode === 2 ? "Repeat queue" : "Repeat song" : "Off"

            message.channel.send(new MessageEmbed()
                .setDescription(`<:icone_verified:824290381435895818> | Mode de loop mis à jour : \`${mode}\``)
                .setColor(`14b321`)
            );
        }
    },
};