import { Client, Interaction } from "discord.js"

export {}


export type buttonInteractionType = {
    customId: string,
    run: (client: Client, interaction: Interaction) => void
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string,
            mongoUri: string,
            appPath: string
        }
    }
}


