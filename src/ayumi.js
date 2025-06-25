const { Client, Events, GatewayIntentBits } = require('discord.js')

const { token } = require('./config/config.json')

const ayumi = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
})

ayumi.once(Events.ClientReady, client => {
	console.log(`${client.user.username} is now Online.`)
})

ayumi.login(token)