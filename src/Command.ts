import { CommandInteraction, ChatInputApplicationCommandData, Client, Message } from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: CommandInteraction) => void;
}