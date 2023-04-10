import { buttonInteractionType } from '../../typings'
import { AcceptTransferOffer } from './acceptTransferOffer'
import { RejectTransferOffer } from './rejectTransferOffer'

export const Events: buttonInteractionType[] = [
    AcceptTransferOffer,
    RejectTransferOffer
]