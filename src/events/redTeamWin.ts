import { Client, Interaction } from "discord.js";
import { Team, TransferOffer, Match } from "../utils/mongodb/Models";
import { buttonInteractionType } from "typings";
import { checkPlayerInTeam, updatePlayerTeam } from "../utils/mongodb/teamDb";
import { ObjectId } from "mongodb";

const customId = 'red_team_win_'


export const RedTeamWin: buttonInteractionType = {
    customId,
    run: async (client: Client, interaction: Interaction) => {
        if (!interaction.isButton()) return
        const user = interaction.user.id || ''
        const matchObjectId = interaction.customId.replaceAll(customId, '')
        const match = await Match.findOne({_id: new ObjectId(matchObjectId)})
        if (match?.redTeamCaptain != user && match?.blueTeamCaptain != user) {
            //here mesaj gelecek
            return
        }
        interaction.reply({
            content:'test'
        })
    }
}