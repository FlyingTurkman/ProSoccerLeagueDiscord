import { Client, CommandInteraction, ApplicationCommandType } from "discord.js";
import { Command } from "../Command";
import { STRING } from "../utils/src/options";
import { Team } from "../utils/mongodb/Models";
import { checkGuildHasTeam, checkPlayerInTeam } from "../utils/mongodb/teamDb";






export const TeamCreate: Command = {
    name: 'team_create',
    description: 'You can create team with this command',
    type: ApplicationCommandType.ChatInput,
    options: [
        {type: STRING, name: 'team_name', description: 'Team Name', required: true, min_length: 3, max_length: 25},
        {type: STRING, name: 'team_tag', description: 'Team Tag', required: true, min_length: 2, max_length: 5}
    ],
    run: async(client: Client, interaction: CommandInteraction) => {
        const teamId = interaction.guild?.id || ''
        const avatar = interaction.guild?.iconURL()
        const teamName = interaction.options.get('team_name')?.value || ''
        const teamTag = interaction.options.get('team_tag')?.value || ''
        const captainId = interaction.user.id || ''
        try {
            const playerInTeam = await checkPlayerInTeam({playerId: captainId})
            if (playerInTeam) {
                await interaction.reply({
                    content: 'You already in a team. You must leave from your team.',
                    ephemeral: true
                })
                return
            }
            const guildHasTeam = await checkGuildHasTeam({guildId: teamId})
            if (guildHasTeam) {
                await interaction.reply({
                    content: 'This discord server already has a team.',
                    ephemeral: true
                })
                return
            }
            await Team.create({
                teamId,
                captainId,
                teamName,
                teamTag,
                teamLogo: avatar,
                members: [
                    captainId
                ]
            })
            await interaction.reply({
                content: `${teamName} succesfully created.`,
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