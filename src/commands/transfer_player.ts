import { Client, CommandInteraction, ApplicationCommandType,EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Command } from "../Command";
import { USER } from "../utils/src/options";
import { checkIsPlayerTeamCaptainOrCoCaptain, checkPlayerInTeam } from "../utils/mongodb/teamDb";
import { Team } from "../utils/mongodb/Models";




export const TransferPlayer: Command = {
    name: 'transfer_player',
    description: 'You can send transfer offer a player with this command.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {type: USER, name: 'user', description: 'Choose player', required: true}
    ],
    run: async(client: Client, interaction: CommandInteraction) => {
        const captainId = interaction.user.id
        const user = interaction.options.get('user')?.value || ''
        const isPlayerCanOffer = await checkIsPlayerTeamCaptainOrCoCaptain({playerId: captainId})
        if (!isPlayerCanOffer) {
            await interaction.reply({
                content: 'Only team captain or co-captain send transfer offer.'
            })
            return
        }
        const captainTeam = await Team.findOne({teamId: isPlayerCanOffer})
        const row = new ActionRowBuilder<ButtonBuilder>()
        row.addComponents(
            new ButtonBuilder()
                .setCustomId('accept_transfer_offer')
                .setLabel('Accept')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('reject_transfer_offer')
                .setLabel('Reject')
                .setStyle(ButtonStyle.Danger)
        )
        const embed = new EmbedBuilder()
        embed.setColor('Red')
        embed.setTitle(`${captainTeam?.teamName || ''} want to transfer you.`)
        embed.addFields(
            {name: 'From Team', value: captainTeam?.teamName || ''}
        )
        embed.setThumbnail(captainTeam?.teamLogo || '')
        client.users.cache.get(user.toString())?.send({
            embeds: [embed],
            components: [row]
        })
        const playerTeam = await checkPlayerInTeam({playerId: user?.toString()})
        if (playerTeam) {
            const transferChannel = client.channels.cache.get(playerTeam.transferChannel || '')
            if (transferChannel?.isTextBased()) {
                transferChannel.send({
                    content: `Hello <@${user}>. You have a transfer offer. Please answer it as soon as possible.`,
                    embeds: [embed],
                    components: [row]
                })
            }
        }else {

        }

        await interaction.reply({
            content: 'Transfer offer succesfully sended. Waiting for answer',
            ephemeral: true
        })
        /* const row = new ActionRowBuilder<ButtonBuilder>()
        row.addComponents(
            new ButtonBuilder()
                .setCustomId('button')
                .setLabel('click Me')
                .setStyle(ButtonStyle.Primary)
        )
        const embed = new EmbedBuilder()
        embed.setColor('Red')
        embed.setTitle('Test')
        client.users.cache.get(captainId)?.send({embeds: [embed], components: [row]}) */
    }
}