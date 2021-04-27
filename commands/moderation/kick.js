const Discord = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Exclus la personne mentionnée !',
    usage: '<mention> {raison}',
    guildOnly: true,
    cooldown: 5,
    args: true,
    permissions: 'KICK_MEMBERS',
    execute(client, message, args) {
        let mec = message.mentions.users.first() || message.guild.members.cache.find(user => user.id === args[0]);
        let kick = message.guild.member(mec);

        if (!kick) {

            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas **trouvé** la personne mentionnée.`)
                .setColor("d10000")

            return message.reply(embed).then(sent => sent.delete({timeout: 5e3}));
        }

        if(kick.hasPermission('ADMINISTRATOR' || 'KICK_MEMBERS')) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas pu exclure la personne car celle-ci est un(e) "\`Membre du Staff\`".`)
                .setColor("d10000")

            return message.reply(embed).then(sent => sent.delete({timeout: 5e3}));

        }

        if (!message.guild.member(client.user).hasPermission("KICK_MEMBERS")) {

            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas pu exclure la personne car je n'ai pas la permission "\`BAN_MEMBERS\`".`)
                .setColor("d10000")

            return message.reply(embed).then(sent => sent.delete({timeout: 5e3}));
        }

        kick.kick().then(member => {

            const raison = args.slice(1).join(' ');

            if (!raison) {

                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:icone_verified:824290381435895818> | __**${member.user.username}**__ a bien été exclu par __**${message.author.username}**__\n\n__Raison__ : **Aucune raison spécifiée.**`)
                    .setColor("14b321")

                message.channel.send(embed);

                const embed1 = new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Vous avez été exclu du serveur __**${message.guild.name}**__ par __**${message.author.username}**__.\n\n__Raison__ : **Aucune raison spécifiée.**`)
                    .setColor("d10000")

                kick.send(embed1).catch(console.error);
                
            } else {

                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:icone_verified:824290381435895818> | __**${member.user.username}**__ a bien été exclu par __**${message.author.username}**__\n\n__Raison__ : **${raison}**`)
                    .setColor("14b321")

                message.channel.send(embed);

                const embed1 = new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Vous avez été exlu du serveur __**${message.guild.name}**__ par __**${message.author.username}**__.\n\n__Raison__ : **${raison}**`)
                    .setColor("d10000")

                kick.send(embed1).catch(console.error);
            }
        });
    },
};