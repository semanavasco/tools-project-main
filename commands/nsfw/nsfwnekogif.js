const Discord = require('discord.js');
const nekoclient = require('nekos.life');
const neko = new nekoclient();

module.exports = {
    name: 'nsfwnekogif',
    description: 'Envoie une image porno dans un salon NSFW.',
    usage: '',
    guildOnly: true,
    cooldown: 5,
    execute(client, message, args) {
        if (!message.channel.nsfw === true) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Essaye plutôt dans un salon "\`NSFW\`".`)
                .setColor("d10000")

            return message.reply(embed);
        }
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;
        
        if (!message.guild) return;
        async function nsfwnekogif() {
            const GIF = await neko.nsfw.nekoGif();
            const embed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setTitle(`Clique ici si l'imagine ne charge pas !`)
                .setURL(GIF.url)
                .setImage(GIF.url)
                .setFooter(`NSFWnekogif | Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }))
                
            message.channel.send(embed);
        }
        nsfwnekogif();
    }
}