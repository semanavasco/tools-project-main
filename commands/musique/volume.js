const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'volume',
    description: 'Change le volume du bot.',
    usage: '<volume>',
    guildOnly: false,
    cooldown: 5,
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

            if (isNaN(args[0])) {
                if (isNaN(args[0])) return message.reply('essaye en spécifiant un nombre !').then(sent => sent.delete({ timeout: 5e3 }));
            }
            else if (args[0] < 1 || args[0] > 100) {
                const embed = new MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Le volume doit être compris entre "\`1 et 100\`".`)
                    .setColor("d10000")

                return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
            }
            else {
                client.distube.setVolume(message, args[0])

                message.channel.send(new MessageEmbed()
                    .setDescription(`<:icone_verified:824290381435895818> | Volume pour toutes les musiques actuelles changé, volume actuel : \`${args[0]}\``)
                    .setColor(`14b321`)
                );
            }
        }
    },
};