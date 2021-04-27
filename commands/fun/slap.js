const Discord = require('discord.js');

module.exports = {
    name: 'slap',
    description: 'Mets une baffe à la personne de ton choix !',
    usage: '{mention}',
    guildOnly: false,
    cooldown: 5,
    aliases: ["baffe", "steak"],
    execute(client, message, args) {
        var mentionnedUser = message.mentions.users.first();

        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        if (!mentionnedUser) {
            let slap = ["https://media.discordapp.net/attachments/715949616540942366/716613160009728020/4MQkDKm.gif?width=450&height=214", "https://media.discordapp.net/attachments/715949616540942366/716613171053330503/6fc8d6bbe59fba01-anime-slap-tumblr.gif?width=450&height=249", "https://media.discordapp.net/attachments/715949616540942366/716613174899638292/94497ee535b842b3bb0e274885fb7d9ec7c74691_hq.gif?width=315&height=177", "https://media.discordapp.net/attachments/715949616540942366/716613188287987782/d6wv007-5fbf8755-5fca-4e12-b04a-ab43156ac7d4.gif?width=855&height=481", "https://media.discordapp.net/attachments/715949616540942366/716613203928416276/DefiantBlindHyena-size_restricted.gif?width=400&height=225", "https://media.discordapp.net/attachments/715949616540942366/716613215001509898/fm49srQ.gif?width=540&height=304", "https://media.discordapp.net/attachments/715949616540942366/716613220932255804/giphy_1.gif?width=405&height=228", "https://media.discordapp.net/attachments/715949616540942366/716613231015362580/giphy_2.gif?width=360&height=202", "https://media.discordapp.net/attachments/715949616540942366/716613234496634920/giphy_3.gif?width=450&height=253", "https://media.discordapp.net/attachments/715949616540942366/716613241073041418/giphy.gif?width=332&height=211", "https://media.discordapp.net/attachments/715949616540942366/716613246928420914/iFwdi4l06yUfakZDVoMBb8vtT-nSCBnddM-yee959XqOFiyXomKydVwy7vVhNX20xMF9nW-maaq_ZIVri75aZft3i5W47v9qEzqL.gif?width=450&height=253", "https://media.discordapp.net/attachments/715949616540942366/716613261247905832/PersonalUnlinedAsiaticwildass-size_restricted.gif?width=450&height=253", "https://media.discordapp.net/attachments/715949616540942366/716613260882739240/oneslap-man.gif?width=360&height=200", "https://media.discordapp.net/attachments/715949616540942366/716613266624741376/tenor_1.gif?width=448&height=252", "https://media.discordapp.net/attachments/715949616540942366/716613269187723274/tenor_2.gif?width=448&height=250", "https://media.discordapp.net/attachments/715949616540942366/716613274644250684/tenor.gif?width=448&height=250", "https://media.discordapp.net/attachments/715949616540942366/716613277769138226/zvnbzPY.gif?width=360&height=202"];

            let result = Math.floor((Math.random() * slap.length));

            const embed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setDescription(`👋 | **${message.author.username}** met une baffe à **${client.user.username}** !`)
                .setImage(slap[result])
                .setTimestamp()
                .setFooter(`Slap !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))

            message.channel.send({ embed: embed });
        } else {

            let slap = ["https://media.discordapp.net/attachments/715949616540942366/716613160009728020/4MQkDKm.gif?width=450&height=214", "https://media.discordapp.net/attachments/715949616540942366/716613171053330503/6fc8d6bbe59fba01-anime-slap-tumblr.gif?width=450&height=249", "https://media.discordapp.net/attachments/715949616540942366/716613174899638292/94497ee535b842b3bb0e274885fb7d9ec7c74691_hq.gif?width=315&height=177", "https://media.discordapp.net/attachments/715949616540942366/716613188287987782/d6wv007-5fbf8755-5fca-4e12-b04a-ab43156ac7d4.gif?width=855&height=481", "https://media.discordapp.net/attachments/715949616540942366/716613203928416276/DefiantBlindHyena-size_restricted.gif?width=400&height=225", "https://media.discordapp.net/attachments/715949616540942366/716613215001509898/fm49srQ.gif?width=540&height=304", "https://media.discordapp.net/attachments/715949616540942366/716613220932255804/giphy_1.gif?width=405&height=228", "https://media.discordapp.net/attachments/715949616540942366/716613231015362580/giphy_2.gif?width=360&height=202", "https://media.discordapp.net/attachments/715949616540942366/716613234496634920/giphy_3.gif?width=450&height=253", "https://media.discordapp.net/attachments/715949616540942366/716613241073041418/giphy.gif?width=332&height=211", "https://media.discordapp.net/attachments/715949616540942366/716613246928420914/iFwdi4l06yUfakZDVoMBb8vtT-nSCBnddM-yee959XqOFiyXomKydVwy7vVhNX20xMF9nW-maaq_ZIVri75aZft3i5W47v9qEzqL.gif?width=450&height=253", "https://media.discordapp.net/attachments/715949616540942366/716613261247905832/PersonalUnlinedAsiaticwildass-size_restricted.gif?width=450&height=253", "https://media.discordapp.net/attachments/715949616540942366/716613260882739240/oneslap-man.gif?width=360&height=200", "https://media.discordapp.net/attachments/715949616540942366/716613266624741376/tenor_1.gif?width=448&height=252", "https://media.discordapp.net/attachments/715949616540942366/716613269187723274/tenor_2.gif?width=448&height=250", "https://media.discordapp.net/attachments/715949616540942366/716613274644250684/tenor.gif?width=448&height=250", "https://media.discordapp.net/attachments/715949616540942366/716613277769138226/zvnbzPY.gif?width=360&height=202"];

            let result = Math.floor((Math.random() * slap.length));

            const embed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setDescription(`👋 | **${message.author.username}** met une baffe à **${mentionnedUser.username}** !`)
                .setImage(slap[result])
                .setTimestamp()
                .setFooter(`Slap !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))

            message.channel.send({ embed: embed });
        }
    },
};