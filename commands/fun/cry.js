const Discord = require('discord.js');

module.exports = {
    name: 'cry',
    description: 'Exprime ton envie de pleurer !',
    usage: '',
    guildOnly: false,
    cooldown: 5,
    aliases: ["pleure"],
    execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        let réponses = ["https://media.discordapp.net/attachments/715949616540942366/717132137052110858/95dccf2308a1b2a9572d74aefda3cf21.gif?width=450&height=252", "https://media.discordapp.net/attachments/715949616540942366/717132141279838279/200.gif?width=318&height=180", "https://media.discordapp.net/attachments/715949616540942366/717132148288651355/733d5948098702b0d6f156819143b581.gif?width=450&height=225", "https://media.discordapp.net/attachments/715949616540942366/717132153648971846/b1ae3cd36795f45af901e3d07df50667.gif?width=450&height=241", "https://media.discordapp.net/attachments/715949616540942366/717132157734223903/Dramatic-Crying-In-Anime-Gif.gif?width=450&height=252", "https://media.discordapp.net/attachments/715949616540942366/717132162586902608/giphy_1.gif?width=450&height=243", "https://media.discordapp.net/attachments/715949616540942366/717132167452295300/giphy.gif?width=450&height=226", "https://media.discordapp.net/attachments/715949616540942366/717132176055074856/oOtoTSB.gif?width=450&height=253", "https://media.discordapp.net/attachments/715949616540942366/717132178873516148/HalfAssuredBorderterrier-size_restricted.gif?width=576&height=423", "https://media.discordapp.net/attachments/715949616540942366/717132181335703642/original.gif?width=486&height=274", "https://media.discordapp.net/attachments/715949616540942366/717132183998824548/tenor_1.gif?width=198&height=229", "https://media.discordapp.net/attachments/715949616540942366/717132187597799484/tenor_2.gif?width=198&height=198", "https://media.discordapp.net/attachments/715949616540942366/717132191745704016/tenor_3.gif?width=198&height=159", "https://media.discordapp.net/attachments/715949616540942366/717132198649790555/tenor.gif?width=360&height=288", "https://media.discordapp.net/attachments/715949616540942366/717132203410325544/tumblr_inline_or4whcrg1z1ueut6r_540.gif?width=486&height=274", "https://media.discordapp.net/attachments/715949616540942366/717132205549420564/WearyCourageousAsianporcupine-size_restricted.gif?width=450&height=255", "https://media.discordapp.net/attachments/715949616540942366/717135001971458108/65b7de83e0c08f0dc38bf6971cd2f2d4.gif?width=450&height=253", "https://media.discordapp.net/attachments/715949616540942366/717135011463168050/268ff0a9609a946ed627a09cf245b635.gif?width=450&height=250", "https://media.discordapp.net/attachments/715949616540942366/717135025870602280/227845948040201.gif?width=450&height=251", "https://media.discordapp.net/attachments/715949616540942366/717135026491359242/Anime-girl-crying.gif?width=450&height=228", "https://media.discordapp.net/attachments/715949616540942366/717135033734791298/BQM6jEZ-UJLgGUuvrNkYUCG8p-X1WhZLiR4h-oxkqQeBRBDdkdOjQt6eDACqauhK_uWlQZkz0hJ_uRHJydU63Q.gif?width=450&height=253", "https://media.discordapp.net/attachments/715949616540942366/717135052340723722/DeliriousExcitableAmericanquarterhorse-size_restricted.gif?width=558&height=322", "https://media.discordapp.net/attachments/715949616540942366/717135053301350460/giphy.gif?width=432&height=245", "https://media.discordapp.net/attachments/715949616540942366/717135053351813120/Crying-Hifumi-Anime-Manga-Know-Your-Meme.gif?width=486&height=274", "https://media.discordapp.net/attachments/715949616540942366/717135060599570462/original_1.gif?width=450&height=253", "https://media.discordapp.net/attachments/715949616540942366/717135062352789534/original.gif?width=450&height=211", "https://media.discordapp.net/attachments/715949616540942366/717135064890343496/tenor.gif?width=225&height=126", "https://media.discordapp.net/attachments/715949616540942366/717135069625712771/tumblr_ogsgltXOAn1tf05g8o1_540.gif?width=486&height=234", "https://media.discordapp.net/attachments/715949616540942366/717135074687975534/unnamed.gif?width=461&height=320"]

        let résultat = Math.floor((Math.random() * réponses.length));

        if (!args[0]) {

            const embed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setDescription(`:cry: | **${message.author.username}** pleure !`)
                .setImage(réponses[résultat])
                .setTimestamp()
                .setFooter(`Cry !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))

            message.channel.send({ embed: embed });
        }
    },
};