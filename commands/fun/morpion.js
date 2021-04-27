const { tictactoe } = require('reconlx');
const Discord = require('discord.js');

module.exports = {
    name: 'morpion',
    description: 'Joue au morpion avec un utilisateur de ton choix !',
    usage: '<utilisateur>',
    guildOnly: false,
    cooldown: 5,
    aliases: ['tictactoe'],
    args: true,
    async execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        const member = message.mentions.users.first();

        if (!member) return message.channel.send(new Discord.MessageEmbed()
            .setDescription("<:icone_indisponible:824290381222117396> | Essaye en mentionnant un utilisateur.")
            .setColor('d10000')
        );

        if (member.bot) return message.channel.send(new Discord.MessageEmbed()
            .setDescription("<:icone_indisponible:824290381222117396> | Essaye en mentionnant un autre utilisateur.")
            .setColor('d10000')
        );

        const messageFilter = m => m.author.id === member.id;

        const request = await message.channel.send(new Discord.MessageEmbed()
            .setDescription(`**${member.username}**, souhaitez vous jouer au morpion contre **${message.author.username}** ?`)
            .setColor(roleColor)
        )

        await message.channel.awaitMessages(messageFilter, { max: 1, time: 15000 }).then(async collected => {
            if (collected.first().content.toLowerCase() === 'oui') {
                collected.delete();
                request.delete();

                new tictactoe({
                    player_two: member,
                    message: message
                });
            } else if (!collected) {
                return message.channel.send(new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Comme le joueur **${member.username}** n'a pas répondu, votre demande **${message.author.username}** a été refusée.`)
                    .setColor('d10000')
                );
            } else {
                return message.channel.send(new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Le joueur **${member.username}** a refusé la demande de morpion contre **${message.author.username}**.`)
                    .setColor('d10000')
                );
            }
        });
    }
}