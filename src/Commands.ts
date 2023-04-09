import { Command } from "./Command";
import { Hello } from "./commands/hello";
import { CreateRegion } from "./commands/create_region";

export const Commands: Command[] = [
    Hello,
    CreateRegion
]