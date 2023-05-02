import { Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Lineup, Region, User } from "../utils/mongodb/Models";
import { buttonInteractionType } from "typings";
import { ObjectId } from "mongodb";
import { BRONZE, ELO_GAP, SILVER } from "../utils/src/constants";



const customId = 'pick_player_'



export const PickPlayer: buttonInteractionType = {
    customId,
    run: async (client: Client, interaction: Interaction) => {
        if (!interaction.isButton()) return
        interaction.reply({
            content: 'Tıklama sikik',
            ephemeral: true
        })
    }
}