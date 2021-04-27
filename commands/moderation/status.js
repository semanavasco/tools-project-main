const Discord = require('discord.js');
const GuildStatus = require('../../models/GuildStatus.js');

module.exports = {
    name: 'status',
    description: 'Permets de configurer le module status !',
    usage: '',
    guildOnly: true,
    cooldown: 5,
    permissions: 'MANAGE_GUILD',
    async execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        GuildStatus.findOne({
            guildID: message.guild.id
        }, async (err, data) => {
            if (err) console.log(err);

            if (!data) {
                const newData = new GuildStatus({
                    name: message.guild.name,
                    guildID: message.guild.id,
                    onoff: false,
                    role: '',
                    status: ''
                });

                newData.save().catch(err => console.log(err));
            }

            let role = '';
            let status = '';

            if (!data.role || data.role === '') {
                role = 'Pas Définit';
            } else {
                role = `<@&${data.role}>`;
            }

            if (!data.status || data.status === '') {
                status = 'Pas Définit';
            } else {
                status = `${data.status}`;
            }

            const statuses = {
                true: "<a:animated_check:826378817680703508> - Activé",
                false: "<a:animated_notcheck:826378869077573642> - Désactivé"
            }

            const embed = new Discord.MessageEmbed()
                .setTitle("Custom Status Config \n\n")
                .setDescription("\n\n")
                .setColor(roleColor)
                .setDescription(`Appuyez sur les réactions pour valider votre choix.\n\n<:icone_role:824290384204660806> - Choisir le Rôle à Attribuer.\n<:icone_rpc:824290384153673760> - Choisir le Status à Mettre.\n<a:animated_check:826378817680703508> - Activer le Module.\n<a:animated_notcheck:826378869077573642> - Desactiver le Module.\n\n**Configuration Actuelle du Serveur**`)
                .addFields(
                    { name: "<:icone_voicelock:824290380870713374> - Module :", value: `${statuses[data.onoff]}`, inline: false },
                    { name: "<:icone_role:824290384204660806> - Rôle :", value: `${role}`, inline: false },
                    { name: "<:icone_rpc:824290384153673760> - Status :", value: `${status}`, inline: false },
                )
                .setFooter('Tools Custom Status', client.user.avatarURL())
                .setTimestamp()

            const reactionMessage = await message.channel.send(embed);

            await reactionMessage.react('824290384204660806');
            await reactionMessage.react('824290384153673760');
            await reactionMessage.react('826378817680703508');
            await reactionMessage.react('826378869077573642');

            const messageFilter = m => m.author.id === message.author.id;
            const reactionFilter = (reaction, user) => ['824290384204660806', '824290384153673760', '826378817680703508', '826378869077573642'].includes(reaction.emoji.id) && (message.author.id === user.id);
            const collector = reactionMessage.createReactionCollector(reactionFilter);

            collector.on('collect', async (reaction, user) => {
                if (reaction.emoji.id === '824290384204660806') {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription(`Envoyez ci-dessous l'ID du rôle à ajouter. Vous avez 15 secondes.`)
                        .setColor(roleColor)
                    );
                    await message.channel.awaitMessages(messageFilter, { max: 1, time: 15000 }).then(async collected => {
                        let collectedRole = message.guild.roles.cache.find(role => role.id === collected.first().content) || message.guild.roles.cache.find(role => role.name === collected.first().content.toLowerCase());
                        data.role = collectedRole.id;
                        data.save();

                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_verified:824290381435895818> | Le rôle à ajouter sera désormais le suivant : <@&${data.role}>.`)
                            .setColor('14b321')
                        );
                    });
                } else if (reaction.emoji.id === '824290384153673760') {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription(`Envoyez ci-dessous le status que les utilisateurs doivent avoir. Vous avez 30 secondes.`)
                        .setColor(roleColor)
                    );
                    await message.channel.awaitMessages(messageFilter, { max: 1, time: 15000 }).then(async collected => {
                        let collectedStatus = collected.first().content;
                        data.status = collectedStatus;
                        data.save();

                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_verified:824290381435895818> | Le status que les utilisateurs doivent avoir sera désormais le suivant : ${data.status}.`)
                            .setColor('14b321')
                        );
                    });
                } else if (reaction.emoji.id === '826378817680703508') {
                    if (data.onoff === true) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_indisponible:824290381222117396> | ${user}, le Module des Status est déjà activé sur ce serveur.`)
                            .setColor('d10000')
                        );
                    }
                    else {
                        data.onoff = true;
                        data.save();
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_verified:824290381435895818> | ${user}, le Module des Status est désormais activé sur ce serveur.`)
                            .setColor('14b321')
                        );
                    }
                } else if (reaction.emoji.id === '826378869077573642') {
                    if (data.onoff === false) {
                        return message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_indisponible:824290381222117396> | ${user}, le Module des Status est déjà désactivé sur ce serveur.`)
                            .setColor('d10000')
                        );
                    }
                    else {
                        data.onoff = false;
                        data.save();
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_verified:824290381435895818> | ${user}, le Module des Status est désormais désactivé sur ce serveur.`)
                            .setColor('14b321')
                        );
                    }
                }
            });
        });
    },
};