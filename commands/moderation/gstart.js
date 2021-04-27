const Discord = require('discord.js');
const ms = require('ms');
const { everyoneMention, hostedBy } = require('../../config.js');

module.exports = {
    name: 'gstart',
    description: 'Crée ton propre giveaway !',
    usage: '<salon> <temps> <gagnants> <prix>',
    guildOnly: true,
    cooldown: 5,
    args: true,
    permissions: 'MANAGE_MESSAGES',
    async execute(client, message, args) {
        let channel = message.mentions.channels.first() || message.guild.channels.cache.find(channel => channel.id === args[0]);

        let giveawayDuration = args[1];

        if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas pu créer le giveaway car vous n'avez pas saisit une durée "\`valide\`".`)
                .setColor("d10000")

            return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
        }

        let giveawayWinners = args[2];

        if (isNaN(giveawayWinners) || (parseInt(giveawayWinners) <= 0)) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas pu créer le giveaway car vous n'avez pas saisit un nombre de gagnants "\`valide\`".`)
                .setColor("d10000")

            return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
        }

        let giveawayPrize = args.slice(3).join(' ');

        if (!giveawayPrize) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas pu créer le giveaway car vous n'avez pas saisit un prix à gagner "\`valide\`".`)
                .setColor("d10000")

            return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
        }

        const embed = new Discord.MessageEmbed()
            .setDescription(`<:icone_verified:824290381435895818> | Le giveaway a commencé dans le salon ${channel}.`)
            .setColor("14b321")

        message.channel.send(embed);

        client.giveawaysManager.start(channel, {
            time: ms(giveawayDuration),
            prize: giveawayPrize,
            winnerCount: giveawayWinners,
            hostedBy: hostedBy ? message.author : null,
            messages: {
                giveaway: (everyoneMention ? '' : '') + '🎉 GIVEAWAY 🎉', // @everyone\n\n
                giveawayEnded: (everyoneMention ? '' : '') + '🎉 GIVEAWAY TERMINÉ 🎉', // @everyone\n\n
                timeRemaining: 'Temps Restant : **{duration}**',
                inviteToParticipate: 'Réagis avec 🎉 pour participer',
                winMessage: 'Bravo à {winners}, qui a remporté le **"{prize}"**',
                embedFooter: 'Heure des Giveaway !',
                noWinner: 'Je n\'ai pas pu déterminer un vainqueur.',
                hostedBy: 'Créé par : {user}',
                winners: 'Gagnant(s) :',
                endedAt: '\nFinit le',
                units: {
                    seconds: 'seconde',
                    minutes: 'minute',
                    hours: 'heure',
                    days: 'jour',
                    plurals: true
                }
            }
        });
    },
};