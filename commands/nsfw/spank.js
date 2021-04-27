const Discord = require('discord.js');

module.exports = {
    name: 'spank',
    description: 'Mets une fessée à la personne de ton choix !',
    usage: '{mention}',
    guildOnly: false,
    cooldown: 5,
    aliases: ["fessée", "fessee"],
    execute(client, message, args) {
        if (message.channel.nsfw === true) {

            const target = message.guild.members.cache.get(message.author.id);
            const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;    

            var mentionnedUser = message.mentions.users.first();

            let spank = ["https://media.discordapp.net/attachments/715949616540942366/716820946677268490/1.gif?width=853&height=480", "https://media.discordapp.net/attachments/715949616540942366/716820945704058911/tenor.gif?width=448&height=252", "https://media.discordapp.net/attachments/715949616540942366/716820948736802906/6DF495Z.gif?width=360&height=202", "https://media.discordapp.net/attachments/715949616540942366/716820953786613840/12b.gif?width=586&height=481", "https://media.discordapp.net/attachments/715949616540942366/716820955984429196/731045715cc97bd01940589a0219b9a8.gif?width=300&height=225", "https://media.discordapp.net/attachments/715949616540942366/716820960715603998/ae72ad3d8ae834f4897f924496a70574.gif?width=432&height=243", "https://media.discordapp.net/attachments/715949616540942366/716820962422685754/f04ca26f48e855babc2b2f269502118b0044cc01_hq.gif?width=576&height=432", "https://media.discordapp.net/attachments/715949616540942366/716820968689107004/mbPE6G.gif?width=432&height=324", "https://media.discordapp.net/attachments/715949616540942366/716820973474807828/Sfz1ki.gif?width=486&height=274", "https://media.discordapp.net/attachments/715949616540942366/716820980399341578/SnappyAcrobaticBelugawhale-size_restricted.gif?width=432&height=331", "https://media.discordapp.net/attachments/715949616540942366/716820997407244438/spanking-animations-432_01BFDG8R7QSPV60T66H0A4EM9X.gif?width=540&height=395", "https://media.discordapp.net/attachments/715949616540942366/716820999466909757/Spanking_5866d4_1755458.gif?width=495&height=278", "https://media.discordapp.net/attachments/715949616540942366/716821008954163200/Spankings_786ff7_6374436.gif?width=544&height=427", "https://media.discordapp.net/attachments/715949616540942366/716821010279563314/Spankings_a76d6e_6374436.gif?width=432&height=243", "https://media.discordapp.net/attachments/715949616540942366/716821015782621264/tenor_1.gif?width=448&height=252", "https://media.discordapp.net/attachments/715949616540942366/716821017502285955/tenor_2.gif?width=198&height=148", "https://media.discordapp.net/attachments/715949616540942366/716821026809577512/tenor_3.gif?width=448&height=252", "https://media.discordapp.net/attachments/715949616540942366/716821026985476126/tenor_4.gif?width=315&height=180"]

            let result = Math.floor((Math.random() * spank.length));

            if (!mentionnedUser) {
                const embed = new Discord.MessageEmbed()
                    .setColor(roleColor)
                    .setDescription(`👋 | **${message.author.username}** met une fessée à **${client.user.username}** !`)
                    .setImage(spank[result])
                    .setTimestamp()
                    .setFooter(`Spank !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))

                message.channel.send({ embed: embed });

            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor(roleColor)
                    .setDescription(`👋 | **${message.author.username}** met une fessée à **${mentionnedUser.username}** !`)
                    .setImage(spank[result])
                    .setTimestamp()
                    .setFooter(`Spank !`, client.user.displayAvatarURL({ format: "png", dynamic: true }))

                message.channel.send({ embed: embed });
            }
        } else {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Essaye plutôt dans un salon "\`NSFW\`".`)
                .setColor("d10000")

            return message.reply(embed);
        }
    },
};