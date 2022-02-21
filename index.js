// Require the necessary discord.js classes
const { Client, Intents } = require("discord.js");
const fs = require("fs");

var config = JSON.parse(fs.readFileSync("./config.json", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
        return {};
    }
    // config = JSON.parse(data);
}));

function updateConfig() {
    fs.writeFile("./config.json", JSON.stringify(config, null, 4), (err) => {
        if (err) console.log(err);

        fs.readFile("./config.json", "utf-8", (err, data) => {
            if (err) {
                console.log(err);
                return {};
            }
            config = JSON.parse(data);
        });
    });
}

// Create a new client instance
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
    console.log("Ready!");
});

client.addListener("messageCreate", (message) => {
    if (message.author.bot) return;

    counting(message);

    if (
        message.content.match(/i'?.*(to)? (pee|piss)( |$)/gim)
            ?.length > 0
    ) {
        config.stats.iHaveToPee++;
        updateConfig();
        if (Math.random < 1 / 100) {
            return message.reply("https://i.imgur.com/XqQZQ.gif");
        }
        return message.reply("go piss gowrl");
    }

    if (message.content.match(/ +L$| +L +|^ *L+ *$/gim)?.length > 0) {
        message.react("🇱");
        return;
    }

    // There is a 0.5% chance that the bot will respond to a message
    let number = Math.random();
    // console.log(number.toString() + " " + (number < chance));
    if (number < config.chance / 100) {
        message.reply("L");
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "chance") {
        if (interaction.options.getNumber("edit")) {
            // TEMPORARY
            // return interaction.reply("Disabled for now due to abuse.");

            if (
                interaction.member.roles.cache.filter((r) =>
                    config.adminRoles.includes(r.id)
                ).size === 0
            ) {
                await interaction.reply(
                    "You do not have permission to use this command."
                );
                return;
            }
            config.chance = interaction.options.getNumber("edit");
            updateConfig();
            await interaction.reply(`Chance is now ${config.chance}%`);
            return;
        }

        await interaction.reply(`Chance is ${config.chance}%`);
    }

    if (interaction.commandName === "counting") {
        if (interaction.options.getSubcommand('reset')) {
            config.countingChannel.count = 0;
            config.countingChannel.lastUser = "";
            config.countingChannel.messupsLeft = config.countingChannel.messupsDefault;
            return await interaction.reply('Reset count sucessfully.');
        }
        return await interaction.reply("not implemented yet");
    }

    if (interaction.commandName === 'stats') {
        if (interaction.options.getSubcommand('pee')) {
            return await interaction.reply(`pee: ${config.stats.iHaveToPee}`);
        }
    }
});

function counting(msg) {
    if (msg.channel.id !== config.countingChannel.id) return;

    if (isNaN(parseInt(msg.content))) return;
    if (msg.content.match(/[\+\-\/\*\^]+/gim)?.length > 0) return;
    // return console.log('counting channel got a message') // msg.reply('nan')
    if (
        msg.author.id === config.countingChannel.lastUser &&
        config.countingChannel.count !== 0
    ){
        msg.react("❌");
        return msg.reply("Not your turn dumbass <3");
    }
    
    if (config.countingChannel.count + 1 === parseInt(msg.content)) {
        msg.react("✅");
        config.countingChannel.count++;
        config.countingChannel.lastUser = msg.author.id;
        if (config.countingChannel.count === config.countingChannel.goal) {
            return msg.reply(
                `Yay, you reached ${config.countingChannel.goal}!`
            );
        }
        updateConfig();
        return;
    } else {
        msg.react("❌");

        if (config.countingChannel.messupsLeft === 0) {
            config.countingChannel.count = 0;
            config.countingChannel.lastUser = "";
            config.countingChannel.messupsLeft =
                config.countingChannel.messupsDefault;
            updateConfig();
            return msg.reply("You **RUINED** it, grrrr!");
        }
        config.countingChannel.messupsLeft--;
        updateConfig();
        return msg.reply(
            `You messed up smh.\nThere are **${
                config.countingChannel.messupsLeft
            }** left for today.\nThe next number is **${
                config.countingChannel.count + 1
            }**\n(Resets in \`xx:xx\`)`
        );
    }
}
// Login to Discord with your client's token
client.login(config.token);

/*

add counting slash commands config
    make counting messups reset every day
    counting mistakes shouldnt count if the current count is 0

add more variations of 'i have to pee'

add a random chance of saying goodnight back


add stats command

*/
