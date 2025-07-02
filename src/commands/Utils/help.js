const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')
const fs = require('fs')
const path = require('path')

const { color } = require('./../../config/color.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all commands or info about a category or command.')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('Category or command name')
                .setRequired(false)
        ),
    usage: '/help [Categorie or Command]',
    async execute(interaction, ayumi) {
        const query = interaction.options.getString('query')
        const commandsPath = path.join(__dirname, '..')
        const categories = fs.readdirSync(commandsPath).filter(file => fs.lstatSync(path.join(commandsPath, file)).isDirectory())

        if(!query) {
            const fields = []

            for(const category of categories) {
                const folderPath = path.join(commandsPath, category)
                const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'))
  
                fields.push({
                    name: category,
                    value: `${commandFiles.length} Commands`,
                    inline: true
                })
            }

            const helpEmbed = new EmbedBuilder()
                .setColor(color.default)
                .setTitle('Command Categories')
                .setAuthor({
                    name: ayumi.user.username,
                    iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
                })
                .setDescription('Here\'s an overview of all command categories. To see the commands within a specific category, use `/help [Category]`')
                .setThumbnail(ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .addFields(fields)

            return await interaction.reply({ embeds: [helpEmbed] })
        }

        const matchedCategory  = categories.find(cat => cat.toLowerCase() === query.toLowerCase())

        if(matchedCategory) {
            const fields = []
            const categoryPath = path.join(commandsPath, matchedCategory)
            const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'))

            for(const file of commandFiles) {
                const command = require(path.join(categoryPath, file))
                if(command.data) {
                    fields.push({
                        name: `${command.data.name}`,
                        value: command.data.description || 'No description provided.',
                        inline: true
                    })
                }
            }

            const helpCategoryEmbed = new EmbedBuilder()
                .setColor(color.default)
                .setTitle(`Commands in ${matchedCategory} category`)
                .setAuthor({
                    name: ayumi.user.username,
                    iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
                })
                .setDescription(`Here are all commands in the **${matchedCategory}** category:`)
                .setThumbnail(ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .addFields(fields)

            return await interaction.reply({ embeds: [helpCategoryEmbed] })
        }

        let foundCommand = null
        let commandCategory = null

        for(const cat of categories) {
            const folderPath = path.join(commandsPath, cat)
            const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'))

            for(const file of commandFiles) {
                const command = require(path.join(folderPath, file))
                if(command.data && command.data.name.toLowerCase() === query.toLowerCase()) {
                    foundCommand = command
                    commandCategory = cat
                    break
                }
            }
            if (foundCommand) break
        }

        if(foundCommand) {
            const helpCommandEmbed = new EmbedBuilder()
                .setColor(color.default)
                .setTitle(`Command: ${foundCommand.data.name}`)
                .setAuthor({
                    name: ayumi.user.username,
                    iconURL: ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 })
                })
                .setDescription(foundCommand.data.description || 'No description provided.')
                .setThumbnail(ayumi.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .addFields(
                    { name: 'Category', value: commandCategory, inline: false },
                    { name: 'Usage', value: '`' + foundCommand.usage + '`' || `/${foundCommand.data.name}`, inline: false }
                )

            return await interaction.reply({ embeds: [helpCommandEmbed] })
        }

        const notFoundEmbed = new EmbedBuilder()
            .setColor(color.error)
            .setTitle('Query Not Found')
            .setDescription(`Sorry, I couldn't find a category or command matching "**${query}**".`)
            .addFields(
                { name: 'Tip:', value: 'Please check your spelling or simply use `/help` to get a list of all available categories and commands.', inline: false }
            )

        await interaction.reply({ embeds: [notFoundEmbed], flags: MessageFlags.Ephemeral })
    }
}