const Discord = require('discord.js');
const LoveCalc = require('../../models/LoveCalc.js');
const Canvas = require('canvas');

module.exports = {
    name: 'lovecalc',
    description: 'Vérifie combien d\'amour tu as pour une certaine personne !',
    usage: '',
    guildOnly: true,
    cooldown: 5,
    args: true,
    aliases: ['lc'],
    async execute(client, message, args) {
        let member = message.mentions.users.first() || message.guild.members.cache.find(user => user.id === args[0]);

        if (!member && args[0].toLowerCase() !== 'random') return message.channel.send(new Discord.MessageEmbed()
            .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas trouvé l'utilisateur mentionné.`)
            .setColor('d10000')
        );

        if (args[0].toLowerCase() === 'random') member = message.guild.members.cache.random();

        const canvas = Canvas.createCanvas(750, 250);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('https://media.discordapp.net/attachments/836162763902418956/836170295257333790/lovecalc.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        const authorAvatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'png' }));
        ctx.drawImage(authorAvatar, 0, 0, 250, 250);

        const memberAvatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }));
        ctx.drawImage(memberAvatar, 500, 0, 250, 250);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'lovecalc.png')

        LoveCalc.findOne({
            guildID: message.guild.id,
            user1ID: message.author.id,
            user2ID: member.user.id
        }, async (err, data) => {
            if (err) console.log(err);

            if (!data) {
                let percent = Math.floor(Math.random() * 99) + 1;

                let percentText = '';

                if (percent < 25) {
                    percentText = `C'est un petit score, mais il ne faut pas baisser les bras !`;
                } else if (percent > 25 && percent < 50) {
                    percentText = `Vous êtes en-dessous de la moyenne, mais une relation reste possible !`;
                } else if (percent > 50 && percent < 75) {
                    percentText = `Vous êtes au-dessus de la moyenne, une relation est envisageable !`;
                } else if (percent > 75 && percent < 99) {
                    percentText = `Votre amour est fort, avez-vous pensé à vous mettre en couple ?`;
                } else if (percent === 100) {
                    percentText = `Il faudrait peut-être penser à vous marier !`;
                }

                const newData = new LoveCalc({
                    name: message.guild.name,
                    guildID: message.guild.id,
                    user1ID: message.author.id,
                    user1Name: message.author.username,
                    user2ID: member.user.id,
                    user2Name: member.user.username,
                    percent: `${percent}`
                });

                newData.save().catch(err => console.log(err));

                message.channel.send(`:revolving_hearts: | **${message.author.username}** et **${member.user.username}**, vous avez un pourcentage de **${percent}%** ! ` + percentText, attachment);
            }

            else {
                let percent = data.percent;

                let percentText = '';

                if (percent < 25) {
                    percentText = `C'est un petit score, mais il ne faut pas baisser les bras !`;
                } else if (percent > 25 && percent < 50) {
                    percentText = `Vous êtes en-dessous de la moyenne, mais une relation reste possible !`;
                } else if (percent > 50 && percent < 75) {
                    percentText = `Vous êtes au-dessus de la moyenne, une relation est envisageable !`;
                } else if (percent > 75 && percent < 99) {
                    percentText = `Votre amour est fort, avez-vous pensé à vous mettre en couple ?`;
                } else if (percent === 100) {
                    percentText = `Il faudrait peut-être penser à vous marier !`;
                }

                message.channel.send(`:revolving_hearts: | **${message.author.username}** et **${member.user.username}**, vous avez un pourcentage de **${percent}%** ! ` + percentText, attachment);
            }
        });
    }
}