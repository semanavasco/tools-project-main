const Discord = require('discord.js');
const ms = require('ms');
const GuildOptions = require('../../models/GuildOptions.js');

module.exports = {
    name: 'tempban',
    description: 'Bannis temporairement une personne précise.',
    usage: '<mention> <temps> {raison}',
    guildOnly: true,
    cooldown: 5,
    args: true,
    permissions: 'BAN_MEMBERS',
    async execute(client, message, args) {
        let prefix = '';

        GuildOptions.findOne({
            guildID: message.guild.id
        }, async (err, data) => {
            if (err) console.log(err);
            if (!data) {
                const newData = new GuildOptions({
                    name: message.guild.name,
                    guildID: message.guild.id,
                    prefix: '$',
                    AntiLink: false,
                    AntiSpam: false,
                    AntiInsults: false
                })
                newData.save().catch(err => console.log(err));

                prefix = '$';
            }
            else {
                prefix = data.prefix;
            }

            let mec = message.mentions.users.first() || message.guild.members.cache.find(user => user.id === args[0]);
            let toban = message.guild.member(mec);

            let time = args[1];

            if (!toban) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas **trouvé** la personne mentionnée.`)
                    .setColor("d10000")

                return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
            }

            if (!time) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Tu n'as pas complété tous les arguments nécessaires.\nLe bon usage serait: "\`${prefix}tempban <mention> <temps> {raison}\`".`)
                    .setColor("d10000")

                return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
            }

            if (toban.hasPermission('ADMINISTRATOR' || 'BAN_MEMBERS')) {
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

            toban.ban().then(member => {

                const raison = args.slice(2).join(' ');

                if (!raison) {
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`<:icone_verified:824290381435895818> | ${member.user.username} a été banni !`)
                        .setDescription(`**Par :** ${message.author}\n**Durée :** ${ms(ms(time))}\n**Raison :** Aucune raison spécifiée`)
                        .setColor("14b321")

                    message.channel.send(embed);

                    const embed1 = new Discord.MessageEmbed()
                        .setTitle(`<:icone_verified:824290381435895818> | Banni du serveur ${message.guild.name}`)
                        .setDescription(`**Par :** ${message.author}\n**Durée :** ${ms(ms(time))}\n**Raison :** Aucune raison spécifiée`)
                        .setColor("d10000")

                    toban.send(embed1);

                } else {
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`<:icone_verified:824290381435895818> | ${member.user.username} a été banni !`)
                        .setDescription(`**Par :** ${message.author}\n**Durée :** ${ms(ms(time))}\n**Raison :** ${raison}`)
                        .setColor("14b321")

                    message.channel.send(embed);

                    const embed1 = new Discord.MessageEmbed()
                        .setTitle(`<:icone_verified:824290381435895818> | Banni du serveur ${message.guild.name}`)
                        .setDescription(`**Par :** ${message.author}\n**Durée :** ${ms(ms(time))}\n**Raison :** ${raison}`)
                        .setColor("d10000")

                    toban.send(embed1);
                }
            });

            setTimeout(async () => {
                const member = toban.id;
                message.guild.members.unban(member);

                const embed1 = new Discord.MessageEmbed()
                    .setDescription(`<:icone_verified:824290381435895818> | Vous avez été unban du serveur __**${message.guild.name}**__.`)
                    .setColor("14b321")

                toban.send(embed1);
            }, ms(time));
        });
    },
};