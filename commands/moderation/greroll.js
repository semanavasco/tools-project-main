const Discord = require('discord.js');

module.exports = {
    name: 'greroll',
    description: 'Reroll un giveaway déjà terminé.',
    usage: '<ID du Giveaway>',
    guildOnly: true,
    aliases: ['giveawayreroll'],
    cooldown: 5,
    args: true,
    permissions: 'MANAGE_MESSAGES',
    async execute(client, message, args) {
        if (!args[0]) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas pu reroll le giveaway car vous n'avez pas saisit un ID "\`valide\`".`)
                .setColor("d10000")

            return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
        }

        let giveaway = client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) || client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

        if (!giveaway) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas pu reroll le giveaway car je n'ai pas trouvé un giveaway avec un tel "\`nom/ID\`".`)
                .setColor("d10000")

            return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
        }

        const embed = new Discord.MessageEmbed()
            .setDescription(`<:icone_verified:824290381435895818> | Le giveaway a bien été "\`reroll\`".`)
            .setColor("14b321")

        client.giveawaysManager.reroll(giveaway.messageID)
            .then(() => {
                message.channel.send(embed)
            })
            .catch((e) => {
                if (e.startsWith(`Giveaway with ID ${giveaway.messageID} is not ended`)) {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas pu reroll le giveaway car il n'est pas encore "\`terminé\`".`)
                        .setColor("d10000")

                    return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
                } else {
                    console.error(e);
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas pu reroll le giveaway car une "\`erreur est survenue\`".`)
                        .setColor("d10000")

                    return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
                }
            });
    },
}