import { Client, CommandInteraction, ApplicationCommandType, EmbedBuilder } from "discord.js";
import { Command } from "../Command";
import { USER } from "../utils/src/options";
import { checkIsCoCaptainSameTeam, checkIsPlayerTeamCaptain } from "../utils/mongodb/teamDb";
import { Team } from "../utils/mongodb/Models";



export const TeamCoCaptain: Command = {
    name: 'team_co_captain',
    description: "You can set your team's co-captain with this command.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {type: USER, name: 'co_captain', description: 'Choose your co-captain.', required: true}
    ],
    run: async(client: Client, interaction: CommandInteraction) => {
        const teamId = interaction.guild?.id || ''
        const user = interaction.options.get('co_captain')?.value || ''
        const captainId = interaction.user.id || ''
        try {
            const isPlayerTeamCaptain = await checkIsPlayerTeamCaptain({playerId: captainId})
            if (!isPlayerTeamCaptain) {
                await interaction.reply({
                    content: 'Only team captain can change co-captain.',
                    ephemeral: true
                })
                return
            }
            const isCoCaptainSameTeam = await checkIsCoCaptainSameTeam({captainId, coCaptainId: user.toString()})
            if (!isCoCaptainSameTeam) {
                await interaction.reply({
                    content: 'This player is not in your team. You must transfer him.',
                    ephemeral: true
                })
                return
            }
            const update = await Team.findOneAndUpdate({
                teamId
            }, {
                $set: {coCaptainId: user.toString()}
            })
            const embed = new EmbedBuilder()
            embed.setColor('Red')
            embed.setImage(update?.teamLogo || '')
            embed.setTitle('You are assigned as co-captain')
            embed.addFields([
                {name: 'Team Name', value: update?.teamName || '', inline: true}
            ])
            client.users.cache.get(user.toString())?.send({embeds: [embed]})
            await interaction.reply({
                content: 'Co-captain succesfully changed.',
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