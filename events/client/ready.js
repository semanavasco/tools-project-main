const welcome = require('../../GuildEvents/welcome.js');
const goodbye = require('../../GuildEvents/goodbye.js');
const status = require('../../GuildEvents/status.js');

module.exports = async (client) => {
    client.user.setPresence({ activity: { name: `$help`, type: 'WATCHING' }, status: 'dnd' });

    console.clear();
    console.log('Prêt !');

    welcome(client);
    goodbye(client);
    status(client);
};