const Discord = require('discord.js');
const nekoclient = require('nekos.life');
const neko = new nekoclient();

module.exports = {
    name: 'blowjob',
    description: 'Envoie une image porno dans un salon NSFW.',
    usage: '',
    guildOnly: false,
    cooldown: 5,
    async execute(client, message, args) {
        if (message.channel.nsfw === true) {
            const target = message.guild.members.cache.get(message.author.id);
            const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

            const GIF = await neko.nsfw.blowJob();

            const embed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setImage(GIF.url)
                .setTimestamp()
                .setTitle(`Clique ici si l'imagine ne charge pas !`)
                .setURL(GIF.url)
                .setFooter(`Blowjob | Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

            message.channel.send({ embed: embed });

        } else {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Essaye plutôt dans un salon "\`NSFW\`".`)
                .setColor("d10000")

            return message.reply(embed);
        }
    },
};