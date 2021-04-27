const Discord = require('discord.js');
const ms = require('ms');
const GuildOptions = require('../../models/GuildOptions.js');

module.exports = {
    name: 'tempmute',
    description: 'Mute la personne mentionnée pendant une durée précise !',
    usage: '<mention> <temps>',
    guildOnly: true,
    cooldown: 5,
    args: true,
    permissions: 'MANAGE_MEMBERS',
    async execute(client, message, args) {
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
            }
            else {
                prefix = data.prefix;
            }

            let mec = message.mentions.users.first() || message.guild.members.cache.find(user => user.id === args[0]);
            let tomute = message.guild.member(mec);
            let time = args[1];

            if (!tomute) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas **trouvé** la personne mentionnée.`)
                    .setColor("d10000")

                return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
            }

            if (!time) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Tu n'as pas complété tous les arguments nécessaires.\nLe bon usage serait: "\`${prefix}tempmute [mention] [temps]\`".`)
                    .setColor("d10000")

                return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
            }

            if (tomute.hasPermission('ADMINISTRATOR' || 'MANAGE_MEMBERS')) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Je ne peux pas mute cette personne.`)
                    .setColor("d10000")

                return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
            }

            if (!message.guild.member(client.user).hasPermission("MANAGE_MEMBERS")) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | Je n'ai pas pu mute la personne car je n'ai pas la permission "\`MANAGE_MEMBERS\`".`)
                    .setColor("d10000")

                return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
            }

            const role = message.guild.roles.cache.find(role => role.name.toLowerCase() === "muted");

            if (!role) {
                try {
                    let muterole = await message.guild.roles.create({
                        data: {
                            name: 'muted',
                            permissions: []
                        }
                    });

                    message.guild.channels.cache.filter(c => c.type === 'text').forEach(async (channel, id) => {
                        await channel.createOverwrite(muterole, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false
                        });
                    });

                } catch (error) {
                    console.log(error);
                }
            }

            let role2 = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');

            if (tomute.roles.cache.has(role2.id)) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:icone_indisponible:824290381222117396> | L'utilisateur mentionné a déjà été "\`mute\`".`)
                    .setColor("d10000")

                return message.reply(embed).then(sent => sent.delete({ timeout: 5e3 }));
            }

            await tomute.roles.add(role2);
            const embed = new Discord.MessageEmbed()
                .setTitle(`<:icone_verified:824290381435895818> | ${tomute.user.username} a été mute !`)
                .setDescription(`**Par :** ${message.author}\n**Durée :** ${ms(ms(time))}`)
                .setColor("14b321")

            message.channel.send(embed);

            const embed1 = new Discord.MessageEmbed()
                .setTitle(`<:icone_verified:824290381435895818> | Mute dans le serveur ${message.guild.name}`)
                .setDescription(`**Par :** ${message.author}\n**Durée :** ${ms(ms(time))}`)
                .setColor("d10000")

            tomute.send(embed1);

            setTimeout(async () => {
                await tomute.roles.remove(role2);

                const embed1 = new Discord.MessageEmbed()
                    .setDescription(`<:icone_verified:824290381435895818> | Vous avez été unmute dans le serveur __**${message.guild.name}**__.`)
                    .setColor("14b321")

                tomute.send(embed1);
            }, ms(time));
        });
    },
};