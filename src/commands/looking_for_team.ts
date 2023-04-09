import { Client, CommandInteraction } from "discord.js";
import { Command } from "../Command";
import { EmbedBuilder } from "discord.js";

export const LookingForTeam: Command = {
    name: 'looking_for_team',
    description: 'deneme',
    run: async (client: Client, interaction: CommandInteraction) => {
        /* const user = await getPlayerByDiscordId({discordId: interaction.user.id})
        console.log (user) */
        const userRes= await fetch(`${process.env.appPath}/api/searchPlayersApi`, {
            method: 'POST',
            body: JSON.stringify({
                term: 'Sharkman'
            })
        })
        const user = await userRes.json()
        const embed = new EmbedBuilder().setTitle('test')
        if (user){
            embed.setTitle(`${user[0].username} looking for team`)
            embed.setColor('Red')
            embed.setAuthor({name: user[0].username, iconURL: user[0].avatar.medium, url: 'https://discord.js.org' })
            embed.setThumbnail(user[0].avatar.medium)
            embed.addFields([
                {name: 'Main position', value: user[0].mainpos, inline: true},
                {name: 'Secondary position', value: user[0].secondpos, inline: true},
            ])
        }
        
        
        await interaction.followUp({
            ephemeral: true,
            embeds:[
                embed,
            ]
        })
    }
}