const { Events, ButtonBuilder, ActionRowBuilder, MessageFlags, EmbedBuilder } = require('discord.js')

const { color } = require('./../../config/color.json')

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

            const originalComponents = interaction.message.components.map(row => {
                const newRow = new ActionRowBuilder()
                row.components.forEach(button => {
                    const newButton = ButtonBuilder.from(button).setDisabled(true)
                    newRow.addComponents(newButton)
                })
                return newRow
            })
            await interaction.message.edit({ components: originalComponents })

            let embed
            if (selectedOptionIndex === correctAnswerIndex) {
                embed = new EmbedBuilder()
                    .setTitle('Correct!')
                    .setColor(color.success)
                    .setAuthor({
                        name: ayumi.user.username,
                        iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
                    })
                    .setDescription('You answered the question correctly! Congratulations.')
            } else {
                const correctOptionText = triviaData.options ? triviaData.options[correctAnswerIndex] : 'Unknown'
                const selectedOptionText = triviaData.options ? triviaData.options[selectedOptionIndex] : 'Unknown'
                
                embed = new EmbedBuilder()
                    .setTitle('Incorrect!')
                    .setColor(color.error)
                    .setAuthor({
                        name: ayumi.user.username,
                        iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
                    })
                    .setDescription('Your answer was unfortunately wrong.')
                    .addFields(
                        { name: 'Your Answer', value: `\`${selectedOptionText}\``, inline: true },
                        { name: 'Correct Answer', value: `\`${correctOptionText}\``, inline: true }
                    )
            }

            await interaction.followUp({ embeds: [embed], flags: MessageFlags.Ephemeral })

            delete ayumi.trivia
        }
    },
}