const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'filter',
    description: 'Change le filtre des musiques.',
    usage: '<3d/bassboost/echo/karaoke/nightcore/vaporwave/off>',
    guildOnly: false,
    cooldown: 5,
    aliases: ['filtre'],
    args: true,
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

            if (args[0] === `3d` || args[0] === `bassboost` || args[0] === `echo` || args[0] === `karaoke` || args[0] === `nightcore` || args[0] === `vaporwave`) {
                let filter = client.distube.setFilter(message, args[0]);

                message.channel.send(new MessageEmbed()
                    .setDescription(`<:icone_verified:824290381435895818> | Filtre "\`${filter}\`" activé avec succès pour toute la queue actuelle.`)
                    .setColor(`14b321`)
                );
            } else if (args[0] === 'off' || args[0] === 'désactivé' || args[0] === 'disable') {
                client.distube.setFilter(message, queue.filter);

                message.channel.send(new MessageEmbed()
                    .setDescription(`<:icone_verified:824290381435895818> | Filtre "\`désactivé\`" avec succès pour toute la queue actuelle.`)
                    .setColor(`14b321`)
                );
            }
            else {
                message.channel.send(new MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Vous devez utiliser comme argument : \`[3d/bassboost/echo/karaoke/nightcore/vaporwave/off]\`.`)
                    .setColor('d10000')
                );
            }
        }
    },
};