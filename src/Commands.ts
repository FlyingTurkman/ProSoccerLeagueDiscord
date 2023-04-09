import { Command } from "./Command";
import { Kim } from "./commands/kim";
import { Test } from "./commands/test";
import { LookingForTeam } from "./commands/looking_for_team";
import { CreateRegion } from "./commands/create_region";

export const Commands: Command[] = [
    Test,
    Kim,
    LookingForTeam,
    CreateRegion
]