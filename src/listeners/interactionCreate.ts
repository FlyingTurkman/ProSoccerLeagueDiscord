import { Client, CommandInteraction, Interaction, InteractionReplyOptions, Options } from "discord.js";
import { Commands } from "../Commands";
import { Test } from "../commands/test";



export default (client: Client): void => {
    client.on('interactionCreate', async (interaction:Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            await handleSlashCommand(client, interaction)
        }
    })
}


async function handleSlashCommand (client: Client, interaction: CommandInteraction):Promise<void> {
    const slashCommand = Commands.find((command) => command.name === interaction.commandName)
    if (!slashCommand){
        interaction.reply({content:'Komut bulunamadı', ephemeral:true})
    }

    if(slashCommand===Test) await interaction.deferReply()

    slashCommand?.run(client, interaction)
}