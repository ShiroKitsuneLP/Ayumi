const { Events, MessageFlags } = require('discord.js')

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, ayumi) {
        if(!interaction.isChatInputCommand()) return

        const command = ayumi.commands.get(interaction.commandName)

        if(!command) {
            console.error(`No command matching ${interaction.commandName} was found.`)
            return
        }

        try {
            await command.execute(interaction, ayumi)
        } catch(err) {
            console.error(err)
            if(interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral })
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral })
            }
        }
    },
}