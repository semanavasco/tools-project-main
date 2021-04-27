const Discord = require('discord.js');

module.exports = {
    name: '8ball',
    description: 'Pose une question au bot !',
    usage: '<question>',
    guildOnly: false,
    cooldown: 5,
    args: true,
    aliases: ["eightball"],
    execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        if (!args[1]) {
            message.reply(new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Essaye en posant une vraie question avec \`plus d'un argument\`.`)
                .setColor(`d10000`)
            ).then(sent => sent.delete({ timeout: 5e3 }));
        }

        let replies = ["Oui.", "Non.", "Peut-être.", "J'ai pas le droit de te le dire.", "Je ne sais pas.", "Redemande-le moi plus tard.", "Flemme de répondre.", "Certainement.", "Bien sûr.", "Mon petit doigt me dit que oui."];

        let result = Math.floor((Math.random() * replies.length));

        let question = args.slice(0).join(" ");

        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ format: "png", dynamic: true }))
            .setTimestamp()
            .setFooter(`8ball !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))
            .setColor(roleColor)
            .addField("Question", question)
            .addField("Réponse", replies[result]);

        message.channel.send(embed);
    },
};