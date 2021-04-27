const fetch = require('node-fetch');
const { parseString } = require('xml2js');
const Discord = require('discord.js');

module.exports = {
    name: 'rule34',
    description: 'Envoie une image porno issue du site rule 34 dans un salon NSFW.',
    usage: '<recherche>',
    guildOnly: false,
    cooldown: 5,
    aliases: ['r34'],
    async execute(client, message, args) {
        if (!message.channel.nsfw === true) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:icone_indisponible:824290381222117396> | Essaye plutôt dans un salon "\`NSFW\`".`)
                .setColor("d10000")

            return message.reply(embed);
        }

        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        const arguments = args.join(' ');
        const argument = arguments.replace(/ /gi, '_');

        const url = 'https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=' + argument;
        try {
            const response = await fetch(url)
            apiData = await response.text()
            parseString(apiData, function (error, result) {
                let postCount = result.posts.$.count - 1;
                if (postCount > 100) {
                    postCount = 100;
                }
                if (postCount > 0) {
                    var picNum = Math.floor(Math.random() * postCount) + 0;
                    var r34Pic = result.posts.post[picNum].$.file_url;
                    message.channel.send(new Discord.MessageEmbed()
                        .setTitle(`Clique ici si l'imagine ne charge pas !`)
                        .setURL(result.posts.post[picNum].$.file_url)
                        .setDescription(`Source : Rule34 | Score : ${result.posts.post[picNum].$.score} | Rating : Explicit`)
                        .setImage(r34Pic)
                        .setColor(roleColor)
                        .setFooter(`Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }))
                    );
                } else {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription("<:icone_indisponible:824290381222117396> | Aucune image trouvée pour la recherche effectuée.")
                        .setColor('d10000')
                    ).then(sent => sent.delete({ timeout: 5e3 }));
                }
            })
        } catch (error) {
            console.log(error);
            message.channel.send(new Discord.MessageEmbed()
                .setDescription("<:icone_indisponible:824290381222117396> | L'accès au site rule34.xxx a échoué, réessayez plus tard.")
                .setColor('d10000')
            ).then(sent => sent.delete({ timeout: 5e3 }));
        }
    }
}