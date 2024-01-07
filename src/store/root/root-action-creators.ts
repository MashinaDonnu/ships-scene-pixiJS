import {AbstractShip} from "scenes/main-scene/objects/abstract.ship";
import {IAction} from "store/action.interface";
import {ERootActions} from "store/root/root-actions.enum";

export function generateShipAction(ship: AbstractShip): IAction<ERootActions, AbstractShip> {
    return { type: ERootActions.generateShip, payload: ship };
}

export function moveToCollectorShipsQueueAction(ship: AbstractShip): IAction<ERootActions, AbstractShip> {
    return { type: ERootActions.moveToCollectorShipsQueue, payload: ship };
}

export function moveToLoadedShipsQueueAction(ship: AbstractShip): IAction<ERootActions, AbstractShip> {
    return { type: ERootActions.moveToLoadedShipsQueue, payload: ship };
}
