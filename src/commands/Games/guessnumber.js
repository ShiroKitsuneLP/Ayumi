const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { color } = require('./../../config/color.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guessnumber')
        .setDescription('Guess a number between 1 and 100. Ayumi will reveal her number!')
        .addIntegerOption(option =>
            option
                .setName('guess')
                .setDescription('Your guess (a number between 1 and 100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        ),
    usage: '/guessnumber <guess>',
    async execute(interaction, ayumi) {
        const userGuess = interaction.options.getInteger('guess')

        const correctNumber = Math.floor(Math.random() * 100) + 1

        let resultText

        if (userGuess === correctNumber) {
            resultText = `Congratulations! You guessed the number **${correctNumber}** correctly!`
        } else {
            resultText = `Oops! Your guess of **${userGuess}** was incorrect. My number was **${correctNumber}**.`
        }

        const guessEmbed = new EmbedBuilder()
            .setColor(color.default)
            .setTitle('Guess the Number Game!')
            .setAuthor({
                name: ayumi.user.username,
                iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
            })
            .setThumbnail(ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setDescription(resultText)
            .addFields(
                { name: 'Your Guess', value: `${userGuess}`, inline: true },
                { name: 'My Number', value: `${correctNumber}`, inline: true },
                { name: 'Range', value: '1 - 100', inline: false }
            )
            
        await interaction.reply({ embeds: [guessEmbed] })
    }
}