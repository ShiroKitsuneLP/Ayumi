const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

const { color } = require('./../../config/color.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Answers your question with wisdom and fluff~')
        .addStringOption(option =>
            option
                .setName('question')
                .setDescription('What is your question?')
                .setRequired(true)
        ),
    usage: '/8ball <question>',
    async execute(interaction, ayumi) {
        const question = interaction.options.getString('question')

        const eightBallResponses = [
            'Absolutely~',
            'Yup yup!',
            'For sure~',
            'Definitely~ I pinky promise!',
            'Mhm... yes~',
            'Nope!',
            'Nuh-uh! Not happening~',
            'No way, silly!',
            'Don\'t count on it~',
            'Hmm... maybe?',
            'It\'s a mystery~',
            'Possibly... who knows?',
            'Try asking again, but cuter~',
            'I\'m not telling~ hehehe~',
            'My tails say yes~',
            'Too fluffy to answer right now~',
            'Ask again when you\'re holding a plushie~',
            'Only if you bring me snacks~',
            'You already know the answer, don\'t you~?',
            'UwU... let fate decide~'
        ]

        const eightBallEmbed = new EmbedBuilder()
            .setColor(color.default)
            .setTitle('The 8Ball Thinks~')
            .setAuthor({
                name: ayumi.user.username,
                iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
            })
            .setThumbnail(ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .addFields(
                { name: 'Your Question', value: question }
            )

        await interaction.reply({ embeds: [eightBallEmbed] })

        setTimeout(async () => {
            const randomEightBallResponse = eightBallResponses[Math.floor(Math.random() * eightBallResponses.length)]

            eightBallEmbed.setTitle('The 8Ball Say~')
            eightBallEmbed.addFields(
                { name: 'My Answer', value: randomEightBallResponse }
            )

            await interaction.editReply({ embeds: [eightBallEmbed] })
        }, 1000)
    }
}