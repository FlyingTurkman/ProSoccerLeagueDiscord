import { CommandInteraction } from "discord.js";


export default async function testHandler(interaction: CommandInteraction) {
    await interaction.deferReply()
}