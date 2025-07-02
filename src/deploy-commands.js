const { REST, Routes } = require('discord.js')
const fs = require('fs')
const path = require('path')

const { clientId, guildId, token } = require('./config/config.json')

const commands = []
const commandsFolderPath = path.join(__dirname, 'commands')
const commandFolder = fs.readdirSync(commandsFolderPath)

for(const folder of commandFolder) {
    const commandsPath = path.join(commandsFolderPath, folder)
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
    for(const file of commandFiles) {
        const filePath = path.join(commandsPath, file)
        const command = require(filePath)
        if('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON())
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
        }
    }
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`)

		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		)

		console.log(`Successfully reloaded ${data.length} application (/) commands.`)
	} catch(err) {
		console.error(`Error loading commands: ${err}`)
	}
})()