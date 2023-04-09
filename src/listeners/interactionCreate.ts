import { CommandInteraction, Client, Interaction, CacheType, ButtonInteraction } from "discord.js";
import { Commands } from "../Commands";
import { Hello } from "../commands/hello";
import { TransferPlayer } from "../commands/transfer_player";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";


export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isButton()) {
            if (interaction.customId == 'button') {
                await interaction.reply('tıkalam')
            }
        }
        if (interaction.isCommand()) {
            await handleSlashCommand(client, interaction);
        }
    });
};

const handleSlashCommand = async (client: Client, interaction: CommandInteraction): Promise<void> => {
    const slashCommand = Commands.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        interaction.followUp({ content: "An error has occurred" });
        return;
    }
    slashCommand.run(client, interaction);

};



