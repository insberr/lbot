const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('./config.json');

const commands = [
    new SlashCommandBuilder()
        .setName('chance')
        .setDescription('The chance of the bot responding with "L"')
        .addNumberOption(option => option.setName('chance').setDescription('Sets the chance of "L"').setMinValue(0.00001).setMaxValue(50)),
    new SlashCommandBuilder()
        .setName('counting')
        .setDescription('Counting stuffs')
        .addSubcommand(subcommand => subcommand.setName('count').setDescription('Change or view the current count number').addNumberOption(option => option.setName('set').setDescription('Set the current count').setMinValue(0).setMaxValue(100000)))
        .addSubcommand(subcommand => subcommand.setName('reset').setDescription('Resets the count'))
        
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationCommands(clientId /*, "523826876599500801" */), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
