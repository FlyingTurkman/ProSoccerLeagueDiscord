import { Client, CommandInteraction } from "discord.js";
import { Command } from "../Command";
import { Lineup, Region } from "../utils/mongodb/Models";
import { Status } from "./status";

export const ClearLineup: Command = {
    name: 'clear_lineup',
    description: 'You can clear lineup with this command.',
    run: async(client: Client, interaction: CommandInteraction) => {
        const user = interaction.user.id
        const isAdmin = await Region.findOne({
            admins: { $in: user}
        })
        if (!isAdmin) {
            await interaction.reply({
                content: 'Only region admins can use this command.',
                ephemeral: true
            })
            return
        }
        const channel = interaction.channel?.id || ''
        if (isAdmin.soloRankedLineup != channel) {
            await interaction.reply({
                content: 'This channel is not lineup text channel.',
                ephemeral: true
            })
            return
        }
        await Lineup.findOneAndUpdate({guildId: isAdmin.guildId}, {
            $set: {
                attackers: [],
                midfielders: [],
                defenders: [],
                goalkeepers: []
            }
        })
        Status.run(client, interaction)
    }
}