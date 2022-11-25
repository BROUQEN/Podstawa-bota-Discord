const { Client, Collection, Events, GatewayIntentBits, REST, Routes } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');

const { token, clientId, } = require('./config.json'); //tutaj wczytujemy wszystko z naszego pliku konfiguracyjnego

const rest = new REST({ version: '10' }).setToken(token);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
	console.log('Bot został włączony!');
});

async function commandsReload() {
    const commands = [
        {
          name: 'ping',
          description: 'Pong!',
        },
        {
          name: 'pong',
          description: 'A nie przypadkiem ping?',
        }
      ];
    try {
      console.log('Started refreshing application (/) commands.');
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    } 
  };

commandsReload();

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Wystąpił błąd podczas wykonywania tej komendy', ephemeral: true });
	}
});

client.login(token);