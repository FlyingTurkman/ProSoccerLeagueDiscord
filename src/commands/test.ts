import { CommandInteraction, Interaction, SlashCommandBuilder } from "discord.js";





export default {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('TEST'),
    async execute (interaction: CommandInteraction) {
        await interaction.reply({
            content: 'test',
            ephemeral: true
        })
    }
}