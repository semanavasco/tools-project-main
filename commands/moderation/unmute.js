const Discord = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'unmute',
    description: 'Unmute la personne mentionnée !',
    usage: '<mention>',
    guildOnly: true,
    cooldown: 5,
    args: true,
    permissions: 'MANAGE_MEMBERS',
    async execute(client, message, args) {
        let mec = message.mentions.users.first() || message.guild.members.cache.find(user => user.id === args[0]);
        let tounmute = message.guild.member(mec);

        if (!tounmute) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas **trouvé** la personne mentionnée.`)
                .setColor("d10000")

            return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
        }

        if (!message.guild.member(client.user).hasPermission("MANAGE_MEMBERS")) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas pu unmute la personne car je n'ai pas la permission "\`MANAGE_MEMBERS\`".`)
                .setColor("d10000")

            return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
        }

        const role = message.guild.roles.cache.find(role => role.name.toLowerCase() === "muted");

        if (!tounmute.roles.cache.has(role.id)) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | L'utilisateur mentionné n'est actuellement pas mute.`)
                .setColor("d10000")

            return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
        }

        await tounmute.roles.remove(role);
        const embed = new Discord.MessageEmbed()
            .setDescription(`<:icone_verified:824290381435895818> | __**${tounmute.user.username}**__ a bien été unmute par __**${message.author.username}**__.`)
            .setColor("14b321")

        message.channel.send(embed);

        const embed1 = new Discord.MessageEmbed()
            .setDescription(`<:icone_verified:824290381435895818> | Vous avez été unmute dans le serveur __**${message.guild.name}**__ par __**${message.author.username}**__.`)
            .setColor("14b321")

        tounmute.send(embed1).catch(console.error);
    },
};