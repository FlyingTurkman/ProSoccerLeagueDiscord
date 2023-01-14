import { Client, CommandInteraction, EmbedBuilder } from "discord.js";
import { Command } from "../Command";



export const Test: Command = {
    name: 'test',
    description: 'deneme',
    run: async (client: Client, interaction: CommandInteraction) => {
        const content = 'deneme aq'
        const embed = new EmbedBuilder().setDescription('Pong!');
        await interaction.followUp({
            ephemeral: true,
            content
        })
    }
}