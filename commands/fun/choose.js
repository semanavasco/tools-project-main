const Discord = require('discord.js');

module.exports = {
    name: 'choose',
    description: 'Laisse le bot faire tes choix !',
    usage: '<choix1> | <choix2> | {choix3} ...',
    guildOnly: false,
    cooldown: 5,
    args: true,
    aliases: ["choisis", "fais-un-choix"],
    execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        if (!args[1]) {
            message.reply(new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Essaye en spécifiant un minimum de \`deux choix\`.`)
                .setColor(`d10000`)
            ).then(sent => sent.delete({ timeout: 5e3 }));
        } else {
            const arguments = args.join(' ').split('|');

            let résultat = Math.floor((Math.random() * arguments.length));

            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ format: "png", dynamic: true }))
                .setTimestamp()
                .setFooter(`Choose !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))
                .setColor(roleColor)
                .addField("Mon choix est", arguments[résultat]);

            message.channel.send(embed);
        }
    },
};