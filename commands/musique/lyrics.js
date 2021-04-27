const { MessageEmbed } = require("discord.js");
const lyricFinder = require("lyrics-finder");

module.exports = {
    name: 'lyrics',
    description: 'Envoie des paroles d\'une chanson.',
    usage: '',
    guildOnly: false,
    cooldown: 5,
    async execute(client, message, args) {
        let artist = '';
        let songName = '';
        let pages = [];
        let currentPage = 0;

        const messageFilter = m => m.author.id === message.author.id;
        const reactionFilter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && (message.author.id === user.id);

        message.channel.send(new MessageEmbed()
            .setDescription(`<:icone_rejoint:824290384250667079> | Pour commencer, veuillez indiquer le nom de \`l'artiste\`.`)
            .setColor(`14b321`)
        );
        await message.channel.awaitMessages(messageFilter, { max: 1, time: 15000 }).then(async collected => {
            artist = collected.first().content;
            message.channel.send(new MessageEmbed()
                .setDescription(`<:icone_rejoint:824290384250667079> | Artiste : \`${artist}\` trouvé, mais maintenant indiquez le nom de \`la musique\`.`)
                .setColor(`14b321`)
            );
            await message.channel.awaitMessages(messageFilter, { max: 1, time: 15000 }).then(async collected => {
                songName = collected.first().content;
                await finder(artist, songName, message, pages)
            });
        });

        const lyricEmbed = await message.channel.send(`Page : ${currentPage + 1}/${pages.length}`, pages[currentPage])
        await lyricEmbed.react('⬅️');
        await lyricEmbed.react('➡️');

        const collector = lyricEmbed.createReactionCollector(reactionFilter);

        collector.on('collect', (reaction, user) => {
            if (reaction.emoji.name === '➡️') {
                if (currentPage < pages.length - 1) {
                    currentPage += 1;
                    lyricEmbed.edit(`Page : ${currentPage + 1}/${pages.length}`, pages[currentPage]);
                }
            } else if (reaction.emoji.name === '⬅️') {
                if (currentPage !== 0) {
                    currentPage -= 1;
                    lyricEmbed.edit(`Page : ${currentPage + 1}/${pages.length}`, pages[currentPage]);
                }
            }
        });
    },
};

async function finder(artist, songName, message, pages) {
    let fullLyrics = await lyricFinder(artist, songName) || `Paroles non trouvées !`;
    const target = message.guild.members.cache.get(message.author.id);
    const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

    for (let i = 0; i < fullLyrics.length; i += 2048) {
        const lyric = fullLyrics.substring(i, Math.min(fullLyrics.length, i + 2048));

        const msg = new MessageEmbed()
            .setDescription(lyric)
            .setColor(roleColor)
        pages.push(msg);
    }
}