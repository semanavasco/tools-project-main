const Discord = require('discord.js');

module.exports = {
    name: 'suicide',
    description: 'Mets fin à ta vie !',
    usage: '',
    guildOnly: false,
    cooldown: 5,
    aliases: ["killmyself", "kill-my-self", "kms"],
    execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        let réponses = ["https://media.discordapp.net/attachments/715949616540942366/715949862235144192/5.gif?width=409&height=481", "https://media.discordapp.net/attachments/715949616540942366/715949862893518859/6.gif?width=225&height=169", "https://media.discordapp.net/attachments/715949616540942366/715949866689495090/7.gif?width=450&height=242", "https://media.discordapp.net/attachments/715949616540942366/715949868027347034/1.gif?width=450&height=225", "https://media.discordapp.net/attachments/715949616540942366/715949869604274237/2.gif?width=486&height=272", "https://media.discordapp.net/attachments/715949616540942366/715949873509433364/4.gif?width=450&height=211", "https://media.discordapp.net/attachments/715949616540942366/715949878387146752/3.gif?width=360&height=202"];

        let résultat = Math.floor((Math.random() * réponses.length));

        const embed = new Discord.MessageEmbed()
            .setColor(roleColor)
            .setDescription(`🔫 | **${message.author.username}** a choisi de mettre fin à sa vie !`)
            .setImage(réponses[résultat])
            .setTimestamp()
            .setFooter(`Suicide !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))

        message.channel.send({ embed: embed });
    },
};