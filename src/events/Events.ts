import { buttonInteractionType } from '../../typings'
import { AcceptTransferOffer } from './acceptTransferOffer'
import { RejectTransferOffer } from './rejectTransferOffer'
import { JoinAsAttacker } from './joinAsAttacker'
import { JoinAsMidfielder } from './joinAsMidfielder'
import { JoinAsDefender } from './joinAsDefender'
import { JoinAsGoalkeeper } from './joinAsGoalKeeper'
import { LeaveQueue } from './leaveQueue'
import { RedTeamWin } from './redTeamWin'
import { CustomJoinLineup } from './customJoinLineup'
import { CustomJoinAsGk } from './customJoinAsGk'
import { CustomLeave } from './customLeave'


export const Events: buttonInteractionType[] = [
    AcceptTransferOffer,
    RejectTransferOffer,
    JoinAsAttacker,
    JoinAsMidfielder,
    JoinAsDefender,
    JoinAsGoalkeeper,
    LeaveQueue,
    RedTeamWin,
    CustomJoinLineup,
    CustomJoinAsGk,
    CustomLeave
]