const { Events, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require('discord.js')

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, ayumi) {
        if(!interaction.isButton()) return

        if(interaction.customId.startsWith('trivia_answer_')) {
            await interaction.deferUpdate()

            const triviaData = ayumi.trivia

            if(!triviaData || interaction.user.id !== triviaData.user) {
                return await interaction.followUp({ content: 'This trivia is not for you, or the quiz has already finished/expired!', flags: MessageFlags.Ephemeral })
            }

            if(Date.now() - triviaData.timestamp > 30 * 1000) {
                await interaction.followUp({ content: 'This trivia question has expired!', flags: MessageFlags.Ephemeral })
                delete ayumi.trivia
                return
            }

            const selectedOptionIndex = parseInt(interaction.customId.split('_')[2])
            const correctAnswerIndex = triviaData.answer

            const originalMessage = interaction.message
            const updatedComponents = []

            for(const row of originalMessage.components) {
                const newRow = new ActionRowBuilder()
                for (const button of row.components) {
                    const newButton = ButtonBuilder.from(button)

                    newButton.setDisabled(true)

                    const buttonIndex = parseInt(newButton.data.custom_id.split('_')[2])

                    if(buttonIndex === correctAnswerIndex) {
                        newButton.setStyle(ButtonStyle.Success)
                    } else if(buttonIndex === selectedOptionIndex) {
                        newButton.setStyle(ButtonStyle.Danger)
                    }
                    newRow.addComponents(newButton)
                }
                updatedComponents.push(newRow)
            }

            await originalMessage.edit({ components: updatedComponents })

            if(selectedOptionIndex === correctAnswerIndex) {
                await interaction.followUp({ content: '**Correct!** Well done!', flags: MessageFlags.Ephemeral })
            } else {
                const correctOptionText = triviaData.options ? triviaData.options[correctAnswerIndex] : 'Unknown'
                await interaction.followUp({ content: `**Incorrect.** The correct answer was: **${correctOptionText}**`, flags: MessageFlags.Ephemeral })
            }
            delete ayumi.trivia
        }
    },
}