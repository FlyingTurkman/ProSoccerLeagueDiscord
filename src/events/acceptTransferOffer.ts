import { Client, Interaction } from "discord.js";
import { Team, TransferOffer } from "../utils/mongodb/Models";
import { buttonInteractionType } from "typings";
import { checkPlayerInTeam, updatePlayerTeam } from "../utils/mongodb/teamDb";
import { ObjectId } from "mongodb";

const customId = 'accept_transfer_offer_'

export const AcceptTransferOffer: buttonInteractionType = {
    customId,
    run: async(client: Client, interaction: Interaction) => {
        if (!interaction.isButton()) return
        const user = interaction.user.id || ''
        const offerId = interaction.customId.replaceAll(customId, '')
        const transfer = await TransferOffer.findOne({_id: offerId})
        if (!transfer) {
            await interaction.reply({
                content: 'Offer does not exist.',
                ephemeral: true
            })
            return
        }
        if (transfer.accepted || transfer.rejected) {
            await interaction.reply({
                content: 'You have been already answered this offer.',
                ephemeral: true
            })
            return
        }
        if (transfer.toPlayer != user) {
            await interaction.reply({
                content: 'You have no permission for this.',
                ephemeral: true
            })
            return
        }
        await TransferOffer.findOneAndUpdate({
            _id: new ObjectId(offerId)
        }, {$set: {
            accepted: true,
            rejected: false
        }})
        const currentTeam = await checkPlayerInTeam({playerId: user})
        if (currentTeam) {
            await Team.findOneAndUpdate({
                teamId: currentTeam.teamId
            }, {
                $pull: {members: user}
            })
        }
        await updatePlayerTeam({playerId: user, teamId: transfer.fromTeam})
        await interaction.reply({
            content: 'Transfer successfully completed.'
        })
    }
}