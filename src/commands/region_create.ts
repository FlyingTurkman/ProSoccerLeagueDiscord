import { STRING } from "../utils/src/options";
import { Command } from "../Command";
import { Client, CommandInteraction, ApplicationCommandType } from 'discord.js'
import { Region } from "../utils/mongodb/Models";
import { checkRegionGuildId, checkRegionNameExist } from "../utils/mongodb/regionDb";





export const CreateRegion: Command = {
    name: 'region_create',
    description: 'You can create region for your leagues with this command',
    type: ApplicationCommandType.ChatInput,
    options: [
        {type: STRING, name: 'region_name', description: 'Region Name', required: true, min_length: 3, max_length: 25},
        {type: STRING, name: 'region_tag', description: 'Region Tag', required: true, min_length: 3, max_length: 5}
    ],
    run: async(client: Client, interaction: CommandInteraction) => {
        const regionName = interaction.options.get('region_name')?.value || ''
        const regionTag = interaction.options.get('region_tag')?.value || ''
        const ownerId = interaction.member?.user.id || ''
        const guildId = interaction.guildId || ''
        const avatar = interaction.guild?.iconURL() || ''
        try {
            const regionGuildIdCheck = await checkRegionGuildId({guildId: guildId.toString()})
            if (regionGuildIdCheck) {
                await interaction.reply({
                    content: 'You can create one region for your discord server.',
                    ephemeral: true
                })
                return
            }
            const regionNameCheck = await checkRegionNameExist({regionName: regionName.toString()})
            if (regionNameCheck) {
                await interaction.reply({
                    content: 'This region name already token',
                    ephemeral: true
                })
                return
            }
            await Region.create({
                guildId,
                admins: [ownerId.toString()],
                ownerId: ownerId.toString(),
                regionName,
                regionTag,
                reagionLogo: avatar
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