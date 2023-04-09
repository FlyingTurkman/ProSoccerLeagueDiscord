import { Client, CommandInteraction, ApplicationCommandType,EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Command } from "../Command";




export const TransferPlayer: Command = {
    name: 'transfer_player',
    description: 'You can send transfer offer a player with this command.',
    type: ApplicationCommandType.ChatInput,
    run: async(client: Client, interaction: CommandInteraction) => {
        const captainId = interaction.user.id

        const row = new ActionRowBuilder<ButtonBuilder>()
        row.addComponents(
            new ButtonBuilder()
                .setCustomId('primary')
                .setLabel('click Me')
                .setStyle(ButtonStyle.Primary)
        )
        const embed = new EmbedBuilder()
        embed.setColor('Red')
        embed.setTitle('Test')
        await interaction.reply({
            content: 'test',
            ephemeral: true,
            embeds: [embed],
            components: [row]
        })
    }
}