import { STRING } from "../utils/src/options";
import { Command } from "../Command";
import { Client, CommandInteraction, ApplicationCommandType } from 'discord.js'
import { Region } from "../utils/mongodb/Models";





export const CreateRegion: Command = {
    name: 'create_region',
    description: 'You can create region for your leagues with this command',
    type: ApplicationCommandType.ChatInput,
    options: [
        {type: STRING, name:'region_name', description: 'Region Name', required: true, min_length: 3, max_length: 25}
    ],
    run: async(client: Client, interaction: CommandInteraction) => {
        const regionName = interaction.options.get('region_name')?.value || ''
        const guildId = interaction.guildId
        try {
            await Region.create({
                guildId,
                admins: [{adminId: 'asdasd'}],
                ownerId: 'asdasd',
                regionName,
                reagionLogo: 'asd'
            })
            await interaction.reply({
                content: regionName?.toString(),
                ephemeral: true
            })
        } catch (error) {
            await interaction.reply({
                content: error.toString(),
                ephemeral: true
            })
        }



    }
}