import { CommandInteraction, Client } from "discord.js";
import { Command } from "../listeners/Command";

export const Hello : Command = {
    name : 'hello',
    description : 'Saying Hello',
    run : async (client: Client, interaction: CommandInteraction)=>{
        const content = 'Hello there'

        await interaction.followUp({
            ephemeral: true,
            content
        })
    }
}