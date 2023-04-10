import { Client, CommandInteraction } from "discord.js";
import { Command } from "../Command";
import { Team } from "../utils/mongodb/Models";
import { checkPlayerInTeam } from "../utils/mongodb/teamDb";



export const TeamLeave: Command = {
    name: 'team_leave',
    description: 'You can leave from your team with this command.',
    run: async(client: Client, interaction: CommandInteraction) => {
        const user = interaction.user.id
        const playerTeam = await checkPlayerInTeam({playerId: user})
        if (!playerTeam) {
            await interaction.reply({
                content: 'You are not in a team.',
                ephemeral: true
            })
            return
        }
        if (playerTeam.captainId == user || playerTeam.coCaptainId == user) {
            await interaction.reply({
                content: 'Captain or co-captain can not leave from team.',
                ephemeral: true
            })
            return
        }
        await Team.findOneAndUpdate({
            members: {$in: [user]}
        }, {$pull: {members: user}})
        await interaction.reply({
            content: `You are succesfully leaved from ${playerTeam.teamName}`,
            ephemeral: true
        })
    }
}