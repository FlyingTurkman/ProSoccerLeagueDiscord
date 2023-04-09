import { Command } from "./Command";
import { Hello } from "./commands/hello";
import { CreateRegion } from "./commands/region_create";
import { TeamCreate } from "./commands/team_create";
import { TeamCoCaptain } from "./commands/team_co_captain";
import { TransferPlayer } from "./commands/transfer_player";
import { TeamSetTransfer } from "./commands/team_set_transfers";


export const Commands: Command[] = [
    Hello,
    CreateRegion,
    TeamCreate,
    TeamCoCaptain,
    TransferPlayer,
    TeamSetTransfer
]