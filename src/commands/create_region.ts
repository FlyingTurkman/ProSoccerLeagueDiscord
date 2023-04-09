import { Client, CommandInteraction, EmbedBuilder } from "discord.js"
import { Command } from "../Command"
import { Region } from "../utils/mongodb/Models"



export const CreateRegion: Command = {
    name: 'create_region',
    description: 'You can create a region for your leagues.',
    run: async (client: Client, interaction: CommandInteraction) => {
        const guildId = interaction.guild?.id
        const region = await Region.findOne({
            guildId
        })
        console.log('i', interaction.options.data)
        if (region) {
            await interaction.reply({
                content: 'This team already created',
                ephemeral: true
            })
        }else {

        }
        const embed = new EmbedBuilder().setTitle('test')
        embed.setColor('Red')
        embed.addFields([
            {name: 'test', value: interaction.guild?.id || 'no id'}
        ])
        await interaction.reply({
            embeds: [
                embed
            ],
            ephemeral: true
        })
    }
}