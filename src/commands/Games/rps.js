const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { color } = require('./../../config/color.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play Rock-Paper-Scissors against Ayumi!')
        .addStringOption(option => 
                option
                    .setName('choice')
                    .setDescription('Choose rock, paper, or scissors')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Rock', value: 'rock' },
                        { name: 'Paper', value: 'paper' },
                        { name: 'Scissors', value: 'scissors' }
                    )
        ),
    usage: '/rps <choice>',
    async execute(interaction, ayumi) {
        const playerChoice = interaction.options.getString('choice')

        const choices = [
            'rock',
            'paper',
            'scissors'
        ]

        const botChoice = choices[Math.floor(Math.random() * choices.length)]

        let result
        
        if(playerChoice === botChoice) {
            result = 'It\'s a draw!'
        } else if((playerChoice === 'rock' && botChoice === 'scissors') || (playerChoice === 'paper' && botChoice === 'rock') || (playerChoice === 'scissors' && botChoice === 'paper')) {
            result = 'You Win!'
        } else {
            result = 'Ayumi Wins!'
        }

        const rpsEmbed = new EmbedBuilder()
            .setColor(color.default)
            .setTitle('Rock-Paper-Scissors Game!')
            .setAuthor({
                name: ayumi.user.username,
                iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
            })
            .setThumbnail(ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .addFields(
                { name: 'You Chose', value: `${playerChoice}`, inline: true },
                { name: 'Ayumi Chose', value: `${botChoice}`, inline: true },
                { name: 'Result', value: result, inline: false }
            )
        
        await interaction.reply({ embeds: [rpsEmbed] })
    }
}