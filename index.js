// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, prefix } = require('./config.json');
const { version } = require('./package.json');
const ge = require('./core/gestion');
const lvl = require('./core/level');
const wel = require('./core/welcome');


// ################################################
// Création d'une nouvelle instance client
const myIntents = new Intents();
myIntents.add(
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MEMBERS,
	Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
	Intents.FLAGS.GUILD_INTEGRATIONS,
	Intents.FLAGS.GUILD_VOICE_STATES,
	Intents.FLAGS.GUILD_PRESENCES,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	Intents.FLAGS.DIRECT_MESSAGES,
	Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
);
const client = new Client({ intents: myIntents });


// ################################################
// Gestion des commandes
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}


// ################################################
// Gestion des événements
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	console.log(event);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// ################### Core #######################
client.once('ready', () => {
	console.log(`Connecté avec le nom : ${client.user.username} \nPrefix : ${prefix} \nVersion : ${version}`);
	console.log('------\n');
});


// ################### Welcome ####################
client.on('guildMemberAdd', async member => {
	const systemchannel = member.guild.systemChannel;
	await wel.memberjoin(member, systemchannel);
});

client.on('guildMemberRemove', async member => {
	const systemchannel = member.guild.systemChannel;
	await wel.memberremove(member, systemchannel);
});

// ################### XP #########################
// client.on('messageCreate', async message => {});

// client.on('messageReactionAdd', async (reaction, user) => {});

// client.on('messageReactionRemove', async (reaction, user) => {});

// client.on('voiceStateUpdate', async (before, after) => {});


// ################################################
// Lancement des commandes
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(token);
