import { buttonInteractionType } from '../../typings'
import { AcceptTransferOffer } from './acceptTransferOffer'
import { RejectTransferOffer } from './rejectTransferOffer'
import { JoinAsAttacker } from './joinAsAttacker'
import { JoinAsMidfielder } from './joinAsMidfielder'

export const Events: buttonInteractionType[] = [
    AcceptTransferOffer,
    RejectTransferOffer,
    JoinAsAttacker,
    JoinAsMidfielder
]