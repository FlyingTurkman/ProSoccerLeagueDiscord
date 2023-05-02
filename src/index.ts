import { Client, GatewayIntentBits, Interaction } from "discord.js";
import dotenv from 'dotenv'
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import mongoose from "mongoose";
import cron from 'node-cron'
import lineupDisconnect from "./listeners/lineupDisconnect";
import matchMakingListener from "./listeners/matchmakingListener";
import customListener from "./listeners/customListener";
import { CustomLineup } from "./utils/mongodb/Models";


dotenv.config()

console.log("Bot is starting...");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

mongoose.connect(process.env.mongoUri || '', {dbName: 'proSoccerLeague'})
.then(() => {
    console.log('Bağlantı başarıyla kuruldu')
})




ready(client)
interactionCreate(client)
matchMakingListener(client)
customListener(client)

cron.schedule('*/10 * * * * *', () => {
    lineupDisconnect(client)
})




client.login(process.env.botToken)