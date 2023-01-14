import { Client, CommandInteraction } from "discord.js";
import { Command } from "../Command";



export const Kim: Command = {
    name: 'kim',
    description: 'kimim',
    run: async (client: Client, interaction: CommandInteraction) => {
        await interaction.reply({
            content: 'Sanane',
            ephemeral: true
        })
    }
}