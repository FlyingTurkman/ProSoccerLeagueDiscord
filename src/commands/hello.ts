import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "../Command";
import { MENTIONABLE } from "../utils/src/options";


export const Hello: Command = {
    name: "hello",
    description: "Returns a greeting",
    type: ApplicationCommandType.ChatInput,
    options: [
        {type: MENTIONABLE, name: 'test', description: 'asdasd', required: true}
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        const content = interaction.options.get('test')?.value
        console.log(content)
        await interaction.reply({
            content: 'test',
            ephemeral: true
        })
    }
};