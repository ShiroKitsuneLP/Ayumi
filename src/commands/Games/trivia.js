const { SlashCommandBuilder, EmbedBuilder, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const { color } = require('./../../config/color.json')
const trivia = require('./../../config/trivia.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Play a trivia quiz!')
        .addStringOption(option =>
            option
                .setName('category')
                .setDescription('Choose a trivia category')
                .setRequired(false)
        ),
    usage: '/trivia [Categorie]',
    async execute(interaction, ayumi) {
        const input = interaction.options.getString('category')
        const categories = Object.keys(trivia)

        if(!input) {
            const fields = []

            for(const category of categories) {
                if(trivia[category] && trivia[category].length > 0) {
                    fields.push({
                        name: category.charAt(0).toUpperCase() + category.slice(1),
                        value: `${trivia[category].length} questions`,
                        inline: true
                    })
                }
            }

            const triviaCategoriesEmbed = new EmbedBuilder()
                .setColor(color.default)
                .setTitle('Trivia Categories')
                .setAuthor({
                    name: ayumi.user.username,
                    iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
                })
                .setDescription(
                    'Here\'s an overview of all available trivia categories. ' +
                    'To start a quiz, use `/trivia <category>` or `/trivia random`.'
                )
                .setThumbnail(ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .addFields(fields)

            return await interaction.reply({ embeds: [triviaCategoriesEmbed] })
        }

        let selectedCategory

        if(input.toLowerCase() === 'random') {
            selectedCategory = categories[Math.floor(Math.random() * categories.length)]
        } else if(!trivia[input.toLowerCase()]) {
            const unknownCategoryEmbed = new EmbedBuilder()
                .setColor(color.error)
                .setTitle('Unknown Trivia Category')
                .setAuthor({
                    name: ayumi.user.username,
                    iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
                })
                .setDescription(`Sorry, I couldn't find the category "**${input}**".`)
                .setThumbnail(ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .addFields(
                    { name: 'Tip:', value: 'Use `/trivia` to see a list of all available categories.', inline: false }
                )

            return await interaction.reply({ embeds: [unknownCategoryEmbed], flags: MessageFlags.Ephemeral })
        } else {
            selectedCategory = input.toLowerCase()
        }

        const questionPool = trivia[selectedCategory]

        if(questionPool.length === 0) {
            const noQuestionsEmbed = new EmbedBuilder()
                .setColor(color.error)
                .setTitle('No Questions Found!')
                .setAuthor({
                    name: ayumi.user.username,
                    iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
                })
                .setDescription(`There are no questions available in the **${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}** category. Please choose another category.`)
                .setThumbnail(ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            
            return await interaction.reply({ embeds: [noQuestionsEmbed], flags: MessageFlags.Ephemeral })
        }

        const randomQuestion = questionPool[Math.floor(Math.random() * questionPool.length)]

        const buttons = new ActionRowBuilder().addComponents(
            randomQuestion.options.map((opt, index) =>
                new ButtonBuilder()
                    .setCustomId(`trivia_answer_${index}`)
                    .setLabel(opt)
                    .setStyle(ButtonStyle.Primary)
            )
        )

        const triviaQuestionEmbed = new EmbedBuilder()
            .setColor(color.default)
            .setTitle(`Trivia - ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`)
            .setAuthor({
                name: ayumi.user.username,
                iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
            })
            .setDescription(`**Question:**\n${randomQuestion.question}`)
            .setThumbnail(ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setFooter({ text: `Question-ID: ${randomQuestion.id}` })

        interaction.client.trivia = {
            answer: randomQuestion.answer,
            user: interaction.user.id,
            timestamp: Date.now(),
            customIdPrefix: 'trivia_answer_',
            options: randomQuestion.options
        }

        await interaction.reply({ embeds: [triviaQuestionEmbed], components: [buttons] })
    }
}