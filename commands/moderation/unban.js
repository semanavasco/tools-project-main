const Discord = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'unban',
    description: 'Unban la personne mentionnée !',
    usage: '<mention>',
    guildOnly: true,
    cooldown: 5,
    args: true,
    permissions: 'MANAGE_MEMBERS',
    async execute(client, message, args) {
        let tounban = args[0];

        if (!tounban) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas **trouvé** la personne mentionnée.`)
                .setColor("d10000")

            return message.reply(embed);
        }

        if (!message.guild.member(client.user).hasPermission("MANAGE_MEMBERS")) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas pu unban la personne car je n'ai pas la permission "\`MANAGE_MEMBERS\`".`)
                .setColor("d10000")

            return message.reply(embed).then(sent => sent.delete({timeout: 5e3}));
        }

        await message.guild.members.unban(tounban);
        const embed = new Discord.MessageEmbed()
            .setDescription(`<:icone_verified:824290381435895818> | __**${tounban}**__ a bien été unban par __**${message.author.username}**__.`)
            .setColor("14b321")

        message.channel.send(embed);
    },
};