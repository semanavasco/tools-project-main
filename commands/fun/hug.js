const Discord = require('discord.js');
const superagent = require('superagent');

module.exports = {
    name: 'hug',
    description: 'Fais un câlin à la personne de ton choix !',
    usage: '{mention}',
    guildOnly: false,
    cooldown: 5,
    aliases: ["câlin", "calin"],
    async execute(client, message, args) {
        var mentionnedUser = message.mentions.users.first();

        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        if (!mentionnedUser) {
            let { body } = await superagent
                .get('https://some-random-api.ml/animu/hug');

            if (!{ body }) return message.reply("je n'ai pas réussi à trouver une image hug, désolé !")

            const embed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setDescription(`🤗 | Awn ! **${message.author.username}** fait un câlin à **${client.user.username}** !`)
                .setImage(body.link)
                .setTimestamp()
                .setFooter(`Hug !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))

            message.channel.send({ embed: embed });
        } else {
            let { body } = await superagent
                .get('https://some-random-api.ml/animu/hug');

            if (!{ body }) return message.channel.send("Je n'ai pas réussi à trouver une image hug ! Désolé !")

            const embed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setDescription(`🤗 | Awn ! **${message.author.username}** fait un câlin à **${mentionnedUser.username}** !`)
                .setImage(body.link)
                .setTimestamp()
                .setFooter(`Hug !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))

            message.channel.send({ embed: embed });
        }
    },
};