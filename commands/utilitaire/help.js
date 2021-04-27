const Discord = require('discord.js');
const GuildOptions = require('../../models/GuildOptions.js');

module.exports = {
    name: 'help',
    description: 'Vous envoie le menu help du bot.',
    usage: '{commande}',
    guildOnly: false,
    cooldown: 5,
    async execute(client, message, args) {
        const { commands } = message.client;
        const data = [];
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        let prefix = '';

        GuildOptions.findOne({
            guildID: message.guild.id
        }, async (err, data) => {
            if (err) console.log(err);
            if (!data) {
                const newData = new GuildOptions({
                    name: message.guild.name,
                    guildID: message.guild.id,
                    prefix: '$',
                    AntiLink: false,
                    AntiSpam: false,
                    AntiInsults: false
                })
                newData.save().catch(err => console.log(err));

                prefix = '$';
            } else {
                prefix = data.prefix;
            }
        });

        if (!args[0]) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`<:icone_rpc:824290384153673760> - Liste des commandes`)
                .setColor(roleColor)
                .setDescription(`<:nouveau:824290384560652348> - Vous pouvez effectuer la commande **${prefix}help <nom de la commande>** pour avoir des informations sur une commande précise !\n\n<:icone_carte:824290384506257438> - **Modération**\n\`\`\`antiinsultes, antilink, antispam, ban, clear, embed, emoji, gblacklist, gblacklistadd, gblacklistremove, gend, goodbyeconfig, greroll, gstart, guildoptions, kick, levelingchannel, levelingmessage, logs, mute, prefix, setgoodbye, setlevels, setwelcome, snipe, sondage, status, tempban, tempmute, unban, unmute, welcomeconfig\`\`\`\n\n<:badge_early_supporter:824290378701340672> - **Fun**\n\`\`\`8ball, baka, bang, cat, cattext, choose, cry, dog, fact, feed, hug, kiss, lizard, lovecalc, morpion, pat, poke, slap, smug, suicide, waifu\`\`\`\n\n<:icone_categorie:824290380932448317> - **Utilitaire**\n\`\`\`args-info, avatar, botinfos, emojis, help, invite, levels, myanimelist, rank, roleinfo, roll, say, serverinfo, serverlogo, userinfo\`\`\`\n\n<:icone_indisponible:824290381222117396> - **NSFW**\n\`\`\`anal, blowjob, boobs, cumart, cumsluts, feet, feetgif, femdom, futanari, gasm, girlsolo, hentai, hentaigif, keta, kitsune, kuni, lesbian, nsfwavatar, nsfwneko, pussy, pussywank, rule34, spank, tits, trap, wallpaper, yuri\`\`\`\n\n<:icone_voicechannel:824290382107770900> - **Musique**\n\`\`\`filter, forceskip, join, leave, loop, lyrics, pause, play, queue, resume, skip, stop, volume\`\`\``)
                .setTimestamp()
                .setFooter(`Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }))

            message.channel.send(embed);
        } else {
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            if (!command) {
                return message.channel.send(new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | La commande \`${name}\` n'existe pas, essayez avec un autre nom !`)
                    .setColor('d10000')
                );
            }

            data.push(`\u200b\n**<:icone_dmd:824290383965585410> - Nom :** *${command.name}*\n`);

            if (command.aliases) data.push(`**<:icone_textchannel:824290380924452914> - Alias :** *${command.aliases.join(', ')}*\n`);
            if (command.description) data.push(`**<:icone_rpc:824290384153673760> - Description :** *${command.description}*\n`);
            if (command.usage) data.push(`**<:badge_staff:824290372758274058> - Utilisation :** *${prefix}${command.name} ${command.usage}*\n`);

            data.push(`**<:icone_indisponible:824290381222117396> - Cooldown :** *${command.cooldown || 3} seconde(s)*\n\u200b`);

            message.channel.send(new Discord.MessageEmbed()
                .setTitle(`Informations sur la Commande - ${name}`)
                .setColor(roleColor)
                .setDescription(data)
                .setTimestamp()
                .setFooter(`Demandé par ${message.author.username} !`, message.author.displayAvatarURL({ format: "png", dynamic: true }))
            );
        }
    },
};