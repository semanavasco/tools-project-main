const Discord = require('discord.js');
const GuildWelcome = require('../../models/GuildWelcome.js');

module.exports = {
    name: 'welcomeconfig',
    description: 'Vous permet de configurer le système de bienvenue.',
    usage: '<texte/embed/image>',
    guildOnly: true,
    cooldown: 5,
    args: true,
    permissions: 'MANAGE_MESSAGES',
    async execute(client, message, args) {
        const target = message.guild.members.cache.get(message.author.id);
        const roleColor = target.displayHexColor === "#000000" ? "#ffffff" : target.displayHexColor;

        GuildWelcome.findOne({
            guildID: message.guild.id
        }, async (err, data) => {
            if (err) console.log(err);

            if (!data) {
                const newData = new GuildWelcome({
                    name: message.guild.name,
                    guildID: message.guild.id,
                    onoff: false,
                    channel: '',
                    embed: {
                        activate: false,
                        title: '',
                        thumbnail: '',
                        description: '',
                        color: '',
                        date: false,
                        image: '',
                        footer: ''
                    },
                    image: {
                        activate: false,
                        image: ''
                    },
                    texte: ''
                });

                newData.save().catch(err => console.log(err));
            }

            else {
                if (args[0].toLowerCase() === 'texte') {
                    const messageFilter = m => m.author.id === message.author.id;

                    message.channel.send(new Discord.MessageEmbed()
                        .setColor(roleColor)
                        .setDescription(`:arrow_heading_down: | Insérez ci-dessous le texte que vous voulez utiliser, vous avez 60 secondes. \n\n\`{userMention}\` : mentionne l'utilisateur\n\`{userName}\` : pour le pseudo de l'utilisateur\n\`{server}\` : pour le nom du serveur\n\`{memberCount}\` : pour le nombre de membres`)
                    );

                    await message.channel.awaitMessages(messageFilter, { max: 1, time: 60000 }).then(async collected => {
                        data.texte = collected.first().content;
                        data.save();
                        message.channel.send(new Discord.MessageEmbed()
                            .setDescription(`<:icone_verified:824290381435895818> | ${message.author}, le texte de bienvenue a bien été enregistré.`)
                            .setColor(`14b321`)
                        );
                    });

                } else if (args[0].toLowerCase() === 'embed') {
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Tools Welcome Config - Embed`)
                        .setDescription(`\n\n`)
                        .setColor(roleColor)
                        .setDescription(`Appuyez sur les réactions pour valider votre choix.`)
                        .setFooter(`Demandé par ${message.author.username} !`, client.user.displayAvatarURL({ format: 'png', dynamic: true }))
                        .setTimestamp()
                        .addFields(
                            { name: '\u200b', value: '<:icone_rpc:824290384153673760> - Configurer l\'embed.', inline: true },
                            { name: '\u200b', value: '<a:animated_check:826378817680703508> - Activer l\'option.', inline: true },
                            { name: '\u200b', value: '<a:animated_notcheck:826378869077573642> - Désactiver l\'option.', inline: true }
                        )

                    const reactionMessage = await message.channel.send(embed);

                    await reactionMessage.react('824290384153673760');
                    await reactionMessage.react('826378817680703508');
                    await reactionMessage.react('826378869077573642');

                    const reactionFilter = (reaction, user) => ['824290384153673760', '826378817680703508', '826378869077573642'].includes(reaction.emoji.id) && (message.author.id === user.id);
                    const collector = reactionMessage.createReactionCollector(reactionFilter);

                    collector.on('collect', async (reaction, user) => {
                        if (reaction.emoji.id === '824290384153673760') {
                            const MainEmbed = new Discord.MessageEmbed()
                                .setTitle(`Welcome Config - Embed Maker`)
                                .setDescription(`\n\nAppuyez sur les réactions pour valider votre choix.\n\n\`🔠\` - Pour Ajouter un Titre.\n\`📋\` - Pour Ajouter une Description.\n\`🎨\` - Pour Modifier la Couleur (HEX).\n\`📌\` - Pour Ajouter un Footer.\n\`📅\` - Pour Ajouter une Date.\n\`🖼️\` - Pour Ajouter une Image.\n\`🧩\` - Pour Ajouter une Thumbnail.\n\n> **Autres réactions :**\n\n\`✅\` - Prévisualiser l'Embed.\n\`❌\` - Supprimer le Configurateur d'Embed.`)
                                .setColor(roleColor)
                                .setFooter('Tools Welcome Config', client.user.avatarURL())
                                .setTimestamp()

                            const EmbedMaker = await message.channel.send(MainEmbed);

                            await EmbedMaker.react('🔠');
                            await EmbedMaker.react('📋');
                            await EmbedMaker.react('🎨');
                            await EmbedMaker.react('📌');
                            await EmbedMaker.react('📅');
                            await EmbedMaker.react('🖼️');
                            await EmbedMaker.react('🧩');
                            await EmbedMaker.react('✅');
                            await EmbedMaker.react('❌');

                            const reactionFilter = (reaction, user) => ['🔠', '📋', '🎨', '📌', '📅', '🖼️', '🧩', '✅', '❌'].includes(reaction.emoji.name) && (message.author.id === user.id);
                            const messageFilter = m => m.author.id === message.author.id;
                            const EmbedMakerCollector = EmbedMaker.createReactionCollector(reactionFilter);

                            EmbedMakerCollector.on('collect', async (reaction, user) => {
                                if (reaction.emoji.name === '🔠') {
                                    const newEmbed = await message.channel.send(new Discord.MessageEmbed()
                                        .setDescription(`:arrow_down: | Ecrivez ci-dessous le titre que vous voulez ajouter à l'embed. (Vous avez 60 secondes)`)
                                    );

                                    await message.channel.awaitMessages(messageFilter, { max: 1, time: 60000 }).then(async collected => {
                                        data.embed.title = collected.first().content;
                                        data.save();
                                        newEmbed.delete();
                                        message.channel.send(`:white_check_mark: | Le nouveau titre a bien été ajouté.`).then(sent => sent.delete({ timeout: 5e3 }));
                                    }).catch(err => {
                                        return;
                                    });
                                } else if (reaction.emoji.name === '📋') {
                                    const newEmbed = await message.channel.send(new Discord.MessageEmbed()
                                        .setDescription(`:arrow_down: | Ecrivez ci-dessous la description que vous voulez ajouter à l'embed. (Vous avez 60 secondes)`)
                                    );

                                    await message.channel.awaitMessages(messageFilter, { max: 1, time: 60000 }).then(async collected => {
                                        data.embed.description = collected.first().content;
                                        data.save();
                                        newEmbed.delete();
                                        message.channel.send(`:white_check_mark: | La nouvelle description a bien été ajoutée.`).then(sent => sent.delete({ timeout: 5e3 }));
                                    }).catch(err => {
                                        return;
                                    });
                                } else if (reaction.emoji.name === '🎨') {
                                    const newEmbed = await message.channel.send(new Discord.MessageEmbed()
                                        .setDescription(`:arrow_down: | Ecrivez ci-dessous le code couleur HEX que vous voulez ajouter à l'embed. (Vous avez 60 secondes)`)
                                    );

                                    await message.channel.awaitMessages(messageFilter, { max: 1, time: 60000 }).then(async collected => {
                                        data.embed.color = collected.first().content;
                                        data.save();
                                        newEmbed.delete();
                                        message.channel.send(`:white_check_mark: | La nouvelle couleur a bien été ajoutée.`).then(sent => sent.delete({ timeout: 5e3 }));
                                    }).catch(err => {
                                        return;
                                    });
                                } else if (reaction.emoji.name === '📌') {
                                    const newEmbed = await message.channel.send(new Discord.MessageEmbed()
                                        .setDescription(`:arrow_down: | Ecrivez ci-dessous le footer que vous voulez ajouter à l'embed. (Vous avez 60 secondes)`)
                                    );

                                    await message.channel.awaitMessages(messageFilter, { max: 1, time: 60000 }).then(async collected => {
                                        data.embed.footer = collected.first().content;
                                        data.save();
                                        newEmbed.delete();
                                        message.channel.send(`:white_check_mark: | Le nouveau footer a bien été ajouté.`).then(sent => sent.delete({ timeout: 5e3 }));
                                    }).catch(err => {
                                        return;
                                    });
                                } else if (reaction.emoji.name === '📅') {
                                    if (data.embed.date === false) {
                                        data.embed.date = true;
                                        data.save();
                                        message.channel.send(`:white_check_mark: | La date a correctement été ajoutée.`).then(sent => sent.delete({ timeout: 5e3 }));
                                    } else {
                                        data.embed.date = false;
                                        data.save();
                                        message.channel.send(`:white_check_mark: | La date a correctement été retirée.`).then(sent => sent.delete({ timeout: 5e3 }));
                                    }
                                } else if (reaction.emoji.name === '🖼️') {
                                    const newEmbed = await message.channel.send(new Discord.MessageEmbed()
                                        .setDescription(`:arrow_down: | Ecrivez ci-dessous l'URL de l'image (un lien d'image) que vous voulez ajouter à l'embed. (Vous avez 60 secondes)`)
                                    );

                                    await message.channel.awaitMessages(messageFilter, { max: 1, time: 60000 }).then(async collected => {
                                        data.embed.image = collected.first().content;
                                        data.save();
                                        newEmbed.delete();
                                        message.channel.send(`:white_check_mark: | La nouvelle image a bien été ajoutée.`).then(sent => sent.delete({ timeout: 5e3 }));
                                    }).catch(err => {
                                        return;
                                    });
                                } else if (reaction.emoji.name === '🧩') {
                                    const newEmbed = await message.channel.send(new Discord.MessageEmbed()
                                        .setDescription(`:arrow_down: | Ecrivez ci-dessous l'URL de la thumbnail (un lien d'image) que vous voulez ajouter à l'embed. (Vous avez 60 secondes)`)
                                    );

                                    await message.channel.awaitMessages(messageFilter, { max: 1, time: 60000 }).then(async collected => {
                                        data.embed.thumbnail = collected.first().content;
                                        data.save();
                                        newEmbed.delete();
                                        message.channel.send(`:white_check_mark: | La nouvelle thumbnail a bien été ajoutée.`).then(sent => sent.delete({ timeout: 5e3 }));
                                    }).catch(err => {
                                        return;
                                    });
                                } else if (reaction.emoji.name === '✅') {
                                    let Embed = new Discord.MessageEmbed()
                                        .setDescription(data.embed.description)
                                        .setThumbnail(data.embed.thumbnail)
                                        .setTitle(data.embed.title)
                                        .setColor(data.embed.color)
                                        .setFooter(data.embed.footer)
                                        .setImage(data.embed.image)

                                    if (data.embed.date === true) {
                                        Embed.setTimestamp();
                                    }

                                    message.channel.send(Embed).then(sent => sent.delete({ timeout: 30000 }));

                                } else if (reaction.emoji.name === '❌') {
                                    EmbedMaker.delete();
                                }
                            });
                        } else if (reaction.emoji.id === '826378817680703508') {
                            if (data.embed.activate === true) {
                                return message.channel.send(new Discord.MessageEmbed()
                                    .setDescription(`<:icone_indisponible:824290381222117396> | ${user}, l'option Embed est déjà activée sur le serveur.`)
                                    .setColor('d10000')
                                );
                            }
                            else {
                                data.embed.activate = true;
                                data.save();
                                message.channel.send(new Discord.MessageEmbed()
                                    .setDescription(`<:icone_verified:824290381435895818> | ${user}, l'option Embed est désormais activée sur le serveur.`)
                                    .setColor('14b321')
                                );
                            }
                        } else if (reaction.emoji.id === '826378869077573642') {
                            if (data.embed.activate === false) {
                                return message.channel.send(new Discord.MessageEmbed()
                                    .setDescription(`<:icone_indisponible:824290381222117396> | ${user}, l'option Embed est déjà désactivée sur le serveur.`)
                                    .setColor('d10000')
                                );
                            }
                            else {
                                data.embed.activate = false;
                                data.save();
                                message.channel.send(new Discord.MessageEmbed()
                                    .setDescription(`<:icone_verified:824290381435895818> | ${user}, l'option Embed est désormais désactivée sur le serveur.`)
                                    .setColor('14b321')
                                );
                            }
                        }
                    });

                } else if (args[0].toLowerCase() === 'image') {
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Tools Welcome Config - Image`)
                        .setDescription(`\n\n`)
                        .setColor(roleColor)
                        .setDescription(`Appuyez sur les réactions pour valider votre choix.`)
                        .setFooter(`Demandé par ${message.author.username} !`, client.user.displayAvatarURL({ format: 'png', dynamic: true }))
                        .setTimestamp()
                        .addFields(
                            { name: '\u200b', value: '<:icone_categorie:824290380932448317> - Configurer l\'image.', inline: true },
                            { name: '\u200b', value: '<a:animated_check:826378817680703508> - Activer l\'option.', inline: true },
                            { name: '\u200b', value: '<a:animated_notcheck:826378869077573642> - Désactiver l\'option.', inline: true }
                        )

                    const reactionMessage = await message.channel.send(embed);

                    await reactionMessage.react('824290380932448317');
                    await reactionMessage.react('826378817680703508');
                    await reactionMessage.react('826378869077573642');

                    const messageFilter = m => m.author.id === message.author.id;
                    const reactionFilter = (reaction, user) => ['824290380932448317', '826378817680703508', '826378869077573642'].includes(reaction.emoji.id) && (message.author.id === user.id);
                    const collector = reactionMessage.createReactionCollector(reactionFilter);

                    EmbedMakerCollector.on('collect', async (reaction, user) => {
                        if (reaction.emoji.id === '824290380932448317') {
                            message.channel.send(new Discord.MessageEmbed()
                                .setColor(roleColor)
                                .setDescription(`:arrow_heading_down: | Insérez ci-dessous le lien de l'image que vous voulez utiliser. Résolution supérieure ou égale à 700x250 px de préférence.`)
                            );

                            await message.channel.awaitMessages(messageFilter, { max: 1, time: 60000 }).then(async collected => {
                                data.image.image = collected.first().content;
                                data.save();
                                message.channel.send(new Discord.MessageEmbed()
                                    .setDescription(`<:icone_verified:824290381435895818> | ${user}, l'image utilisée sera dorénavent la suivante :`)
                                    .setColor(`14b321`)
                                    .setImage(collected.first().content)
                                );
                            });
                        } else if (reaction.emoji.id === '826378817680703508') {
                            if (data.image.activate === true) {
                                return message.channel.send(new Discord.MessageEmbed()
                                    .setDescription(`<:icone_indisponible:824290381222117396> | ${user}, l'option Image est déjà activée sur le serveur.`)
                                    .setColor('d10000')
                                );
                            }
                            else {
                                data.image.activate = true;
                                data.save();
                                message.channel.send(new Discord.MessageEmbed()
                                    .setDescription(`<:icone_verified:824290381435895818> | ${user}, l'option Image est désormais activée sur le serveur.`)
                                    .setColor('14b321')
                                );
                            }
                        } else if (reaction.emoji.id === '826378869077573642') {
                            if (data.image.activate === false) {
                                return message.channel.send(new Discord.MessageEmbed()
                                    .setDescription(`<:icone_indisponible:824290381222117396> | ${user}, l'option Image est déjà désactivée sur le serveur.`)
                                    .setColor('d10000')
                                );
                            }
                            else {
                                data.image.activate = false;
                                data.save();
                                message.channel.send(new Discord.MessageEmbed()
                                    .setDescription(`<:icone_verified:824290381435895818> | ${user}, l'option Image est désormais désactivée sur le serveur.`)
                                    .setColor('14b321')
                                );
                            }
                        }
                    });

                } else {
                    message.channel.send(new Discord.MessageEmbed()
                        .setDescription("<:icone_indisponible:824290381222117396> | Vous devez utiliser les arguments \`<texte/embed/image>\`, réessayez.")
                        .setColor('d10000')
                    ).then(sent => sent.delete({ timeout: 5e3 }));
                }
            }
        });
    },
}