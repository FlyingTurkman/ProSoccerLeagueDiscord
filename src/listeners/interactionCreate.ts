import { CommandInteraction, Client, Interaction } from "discord.js";
import { Commands } from "../Commands";
import { Events } from "../events/Events";


export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isButton()) {
            await handleButtonCommand(interaction.customId, client, interaction)
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


const handleButtonCommand = async (customId: string, client: Client, interaction: Interaction): Promise<void> => {
    const event = Events.find((e) => customId.startsWith(e.customId))
    if (!event) {
        if (interaction.isRepliable()){
            interaction.followUp({ content: "An error has occurred" })
        }
        return
    }
    event.run(client, interaction)    
}



