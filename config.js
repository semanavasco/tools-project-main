const TOKEN = process.env.TOKEN;
const mongo_GUILDOPTIONS = process.env.mongo_GUILDOPTIONS;
const mongo_GUILDLOGS = process.env.mongo_GUILDLOGS;
const mongo_LEVELING = process.env.mongo_LEVELING;
const mongo_LEVELINGMESSAGES = process.env.mongo_LEVELINGMESSAGES;
const mongo_WELCOME = process.env.mongo_WELCOME;
const mongo_GOODBYE = process.env.mongo_GOODBYE;
const mongo_GIVEAWAYSBLACKLIST = process.env.mongo_GIVEAWAYSBLACKLIST;
const mongo_GUILDSTATUS = process.env.mongo_GUILDSTATUS;
const mongo_LOVECALC = process.env.mongo_LOVECALC;
const everyoneMention = false;
const hostedBy = true;

module.exports = {
    TOKEN,
    mongo_GUILDOPTIONS,
    mongo_GUILDLOGS,
    mongo_LEVELINGMESSAGES,
    mongo_LEVELING,
    mongo_WELCOME,
    mongo_GOODBYE,
    mongo_GIVEAWAYSBLACKLIST,
    mongo_GUILDSTATUS,
    mongo_LOVECALC,
    everyoneMention,
    hostedBy
}