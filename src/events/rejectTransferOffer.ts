import { Client, Interaction} from 'discord.js'
import { TransferOffer } from '../utils/mongodb/Models'
import { buttonInteractionType } from 'typings'
import { ObjectId } from 'mongodb'


const customId = 'reject_transfer_offer_'


export const RejectTransferOffer: buttonInteractionType = {
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
            accepted: false,
            rejected: true
        }})
        await interaction.reply({
            content: 'Offer succesfully rejected.'
        })
    }
}