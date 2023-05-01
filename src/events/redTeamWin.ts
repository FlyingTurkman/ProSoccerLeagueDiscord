import { Client, Interaction } from "discord.js";
import { Team, TransferOffer, Match } from "../utils/mongodb/Models";
import { buttonInteractionType } from "typings";
import { checkPlayerInTeam, updatePlayerTeam } from "../utils/mongodb/teamDb";
import { ObjectId } from "mongodb";
import { REDWIN } from "../utils/src/constants";

const customId = 'red_team_win_'


export const RedTeamWin: buttonInteractionType = {
    customId,
    run: async (client: Client, interaction: Interaction) => {
        if (!interaction.isButton()) return
        const user = interaction.user.id || ''
        const matchObjectId = interaction.customId.replaceAll(customId, '')
        const match = await Match.findOne({_id: new ObjectId(matchObjectId)})
        if (!match) {
            interaction.reply({
                content: 'Match not found.'
            })
            return
        }

        //here match ended kontrolü yapılacak
        if (match?.redTeamCaptain != user && match?.blueTeamCaptain != user) {
            interaction.reply({
                content: 'Only captains can vote.'
            })
            return
        }
        if (match.redTeamCaptain == user) {
            const vote = await Match.findOneAndUpdate({
                _id: new ObjectId(matchObjectId)
            }, {$set: {
                redVote: REDWIN
            }})
            if (vote) {
                interaction.reply({
                    content: 'Succesfully voted.'
                })
            }else {
                interaction.reply({
                    content: 'An error has occured.'
                })
            }
        }
        if (match.blueTeamCaptain == user) {
            const vote = await Match.findOneAndUpdate({
                _id: new ObjectId(matchObjectId)
            }, {$set: {
                blueVote: REDWIN
            }})
            if (vote) {
                interaction.reply({
                    content: 'Succesfully voted.'
                })
            }else {
                interaction.reply({
                    content: 'An error has occured.'
                })
            }
        }
    }
}