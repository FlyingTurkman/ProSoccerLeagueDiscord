import { Client, CommandInteraction} from "discord.js";
import { Command } from "../Command";
import { checkIsPlayerTeamCaptainOrCoCaptain } from "../utils/mongodb/teamDb";
import { Team } from "../utils/mongodb/Models";


export const TeamSetTransfer: Command = {
    name: 'team_set_transfers',
    description: "You can set your team's transfer news with this command.",
    run: async(client: Client, interaction: CommandInteraction) => {
        const user = interaction.user.id || ''
        const guildId = interaction.guild?.id || ''
        const isAllowing = await checkIsPlayerTeamCaptainOrCoCaptain({playerId: user})
        if (!isAllowing) {
            await interaction.reply({
                content: 'Only team captain or co-captain can use this command.',
                ephemeral: true
            })
            return
        }
        if (isAllowing != guildId) {
            await interaction.reply({
                content: 'You are not captain or co-captain of this team.',
                ephemeral: true
            })
            return
        }
        const channelId = interaction.channel?.id || ''
        try {
            await Team.findOneAndUpdate({
                teamId: guildId
            }, {$set: {
                transferChannel: channelId
            }})
            await interaction.reply({
                content: 'Setting saved.',
                ephemeral: true
            })
        } catch (error) {
            await interaction.reply({
                content: error,
                ephemeral: true
            })
        }

    }
}