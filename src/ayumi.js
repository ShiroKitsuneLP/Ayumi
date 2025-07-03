const { Client, Collection, Events, GatewayIntentBits } = require('discord.js')
const fs = require('fs')
const path = require('path')

const { token } = require('./config/config.json')

const ayumi = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

ayumi.commands = new Collection()
ayumi.events = new Collection()

const commandsFoldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(commandsFoldersPath)

for(const folder of commandFolders) {
    const commandsPath = path.join(commandsFoldersPath, folder)
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
    for(const file of commandFiles) {
        const filePath = path.join(commandsPath, file)
        const command = require(filePath)
        if('data' in command && 'execute' in command) {
            ayumi.commands.set(command.data.name, command)
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
        }
    }
}

const eventsFoldersPath = path.join(__dirname, 'events')
const eventFolders = fs.readdirSync(eventsFoldersPath)

for(const folder of eventFolders) {
    const eventsPath = path.join(eventsFoldersPath, folder)
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))

    for(const file of eventFiles) {
        const filePath = path.join(eventsPath, file)
        const event = require(filePath)

        if(!event.name) {
			console.log(`[WARNING] The event at ${filePath} is missing a "name" property.`)
            continue
        }

        if(event.once) {
            ayumi.once(event.name, (...args) => event.execute(...args, ayumi))
        } else {
            ayumi.on(event.name, (...args) => event.execute(...args, ayumi))
        }
        ayumi.events.set(event.name, event)
    }
}

ayumi.login(token)