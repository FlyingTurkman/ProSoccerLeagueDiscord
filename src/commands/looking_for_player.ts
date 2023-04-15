import { Client, CommandInteraction, EmbedBuilder } from "discord.js";
import { Command } from "../Command";
import { STRING } from "../utils/src/options";
import { Team } from "../utils/mongodb/Models";


export const LookingForPlayer: Command = {
    name: 'looking_for_player',
    description: 'You can search players for your team',
    options: [
        {name: 'positions', type: STRING ,description: 'Choose positions', min_length: 2, required: true},
        {name: 'note', type: STRING, description: 'Note for players', required: false},
        {name: 'discord', type: STRING, description: 'Discord link for players', required: false}
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        const userId = interaction.user.id
        const positions = interaction.options.get('positions')?.value || ''
        const note = interaction.options.get('note')?.value || 'No note'
        const discordLink = interaction.options.get('discord')?.value || 'Private'
        const teamCheck = await Team.findOne({
            $or: [
                {captainId: userId},
                {coCaptainId: userId}
            ]
        })
        if (!teamCheck) {
            await interaction.reply({
                content: 'Team not found',
                ephemeral: true
            })
            return
        }

        const embed = new EmbedBuilder()
        embed.setTitle(`${teamCheck.teamName} looking for players`)
        embed.setThumbnail(teamCheck.teamLogo || '')
        embed.addFields([
            {name: 'Positions', value: positions.toString().toUpperCase()},
            {name: 'Note for players', value: note.toString()},
            {name: 'Team discord invite', value: discordLink.toString()},
            {name: 'Contact', value: teamCheck.coCaptainId? `<@${teamCheck.captainId}> <@${teamCheck.coCaptainId}>`: `<@${teamCheck.captainId}>`}
        ])
        interaction.reply({
            embeds: [embed]
        })
    }
}