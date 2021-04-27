const Discord = require('discord.js');

module.exports = {
    name: 'gend',
    description: 'Termine un giveaway.',
    usage: '<ID du Giveaway>',
    guildOnly: true,
    aliases: ['giveawayend'],
    cooldown: 5,
    args: true,
    permissions: 'MANAGE_MESSAGES',
    async execute(client, message, args) {
        if (!args[0]) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_disconnect:824290384065593345> | Je n'ai pas pu terminer le giveaway car vous n'avez pas saisit un ID "\`valide\`".`)
                .setColor("d10000")

            return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
        }

        let giveaway = client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) || client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

        if (!giveaway) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_disconnect:824290384065593345> | Je n'ai pas pu terminer le giveaway car je n'ai pas trouvé un giveaway avec un tel "\`nom/ID\`".`)
                .setColor("d10000")

            return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
        }

        const embed = new Discord.MessageEmbed()
            .setDescription(`<:icone_indisponible:824290381222117396> | Le giveaway a bien été "\`terminé\`".`)
            .setColor("14b321")

        client.giveawaysManager.end(giveaway.messageID)
            .then(() => {
                message.channel.send(embed);
            })
            .catch((e) => {
                if (e.startsWith(`Giveaway with message ID ${giveaway.messageID} is already ended`)) {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`<:icone_disconnect:824290384065593345> | Je n'ai pas pu terminer le giveaway car il est déjà "\`terminé\`".`)
                        .setColor("d10000")

                    return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
                } else {
                    console.error(e);
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`<:icone_disconnect:824290384065593345> | Je n'ai pas pu terminer le giveaway car une "\`erreur est survenue\`".`)
                        .setColor("d10000")

                    return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
                }
            });
    },
}