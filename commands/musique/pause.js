const Discord = require('discord.js');

module.exports = {
    name: 'pause',
    description: 'Mets en pause la musique en cours.',
    usage: '',
    guildOnly: false,
    cooldown: 5,
    async execute(client, message, args) {
        if (!message.member.voice.channel) {
            return message.channel.send(new Discord.MessageEmbed()
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
            const queue = await client.distube.getQueue(message);

            if (queue) {
                client.distube.pause(message);

                message.channel.send(new Discord.MessageEmbed()
                    .setDescription(`<:icone_verified:824290381435895818> | ${message.author} musique pausée avec succés.`)
                    .setColor('14b321')
                );
            } else if (!queue) {
                message.channel.send(new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas trouvé de musique \`en cours de lecture\`.`)
                    .setColor('d10000')
                );
            }
        }
    },
};