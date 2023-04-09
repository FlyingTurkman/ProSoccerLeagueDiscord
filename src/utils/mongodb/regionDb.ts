import { Region } from "./Models";





export async function checkRegionNameExist({regionName}: {regionName: string}): Promise<boolean> {
    const check = await Region.findOne({
        regionName
    })
    if (check) {
        return true
    }else {
        return false
    }
}


export async function checkRegionGuildId({guildId}: {guildId: string}): Promise<boolean> {
    const check = await Region.findOne({
        guildId
    })
    if (check) {
        return true
    }else {
        return false
    }
}