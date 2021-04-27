const Discord = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bannis la personne mentionnée !',
    usage: '<mention> {raison}',
    guildOnly: true,
    cooldown: 5,
    args: true,
    permissions: 'BAN_MEMBERS',
    execute(client, message, args) {
        let mec = message.mentions.users.first() || message.guild.members.cache.find(user => user.id === args[0]);
        let ban = message.guild.member(mec);


        if (!ban) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas **trouvé** la personne mentionnée.`)
                .setColor("d10000")

            return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
        }

        if (ban.hasPermission('ADMINISTRATOR' || 'BAN_MEMBERS')) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Je ne peux pas banir cette personne.`)
                .setColor("d10000")

            return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));

        }

        if (!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas pu bannir la personne car je n'ai pas la permission "\`BAN_MEMBERS\`".`)
                .setColor("d10000")

            return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));

        }

        ban.ban().then(member => {
            const raison = args.slice(1).join(' ');

            if (!raison) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`<:icone_verified:824290381435895818> | ${member.user.username} a été banni !`)
                    .setDescription(`**Par :** ${message.author}\n**Durée :** Indéterminée\n**Raison :** Aucune raison spécifiée`)
                    .setColor("14b321")

                message.channel.send(embed);

                const embed1 = new Discord.MessageEmbed()
                    .setTitle(`<:icone_verified:824290381435895818> | Banni du serveur ${message.guild.name}`)
                    .setDescription(`**Par :** ${message.author}\n**Durée :** Indéterminée\n**Raison :** Aucune raison spécifiée`)
                    .setColor("d10000")

                ban.send(embed1);

            } else {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`<:icone_verified:824290381435895818> | ${member.user.username} a été banni !`)
                    .setDescription(`**Par :** ${message.author}\n**Durée :** Indéterminée\n**Raison :** ${raison}`)
                    .setColor("14b321")

                message.channel.send(embed);

                const embed1 = new Discord.MessageEmbed()
                    .setTitle(`<:icone_verified:824290381435895818> | Banni du serveur ${message.guild.name}`)
                    .setDescription(`**Par :** ${message.author}\n**Durée :** Indéterminée\n**Raison :** ${raison}`)
                    .setColor("d10000")

                ban.send(embed1);
            }
        });
    },
};