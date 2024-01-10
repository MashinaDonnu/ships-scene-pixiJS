import {AbstractShip} from "scenes/main-scene/objects/abstract.ship";
import {IAction} from "store/action.interface";
import {ERootActions} from "store/root/root-actions.enum";

export function generateShipAction(ship: AbstractShip): IAction<ERootActions, AbstractShip> {
    return { type: ERootActions.generateShip, payload: ship };
}

export function removeFromGeneratedQueueAction(ship: AbstractShip): IAction<ERootActions, AbstractShip> {
    return { type: ERootActions.removeFromGeneratedQueue, payload: ship };
}

export function moveToCollectorShipsQueueAction(ship: AbstractShip): IAction<ERootActions, AbstractShip> {
    return { type: ERootActions.moveToCollectorShipsQueue, payload: ship };
}

export function removeToCollectorShipsQueueAction(ship: AbstractShip): IAction<ERootActions, AbstractShip> {
    return { type: ERootActions.removeFromCollectorShipsQueue, payload: ship };
}

export function moveToLoadedShipsQueueAction(ship: AbstractShip): IAction<ERootActions, AbstractShip> {
    return { type: ERootActions.moveToLoadedShipsQueue, payload: ship };
}

export function removeToLoadedShipsQueueAction(ship: AbstractShip): IAction<ERootActions, AbstractShip> {
    return { type: ERootActions.removeFromLoadedShipsQueue, payload: ship };
}

export function moveShipToAllShipsQueueAction(ship: AbstractShip): IAction<ERootActions, AbstractShip> {
    return { type: ERootActions.moveShipToAllShipsQueue, payload: ship };
}

export function removeShipFromAllShipsQueueAction(ship: AbstractShip): IAction<ERootActions, AbstractShip> {
    return { type: ERootActions.removeShipFromAllShipsQueue, payload: ship };
}

export function moveShipToPortAction(ship: AbstractShip): IAction<ERootActions, AbstractShip> {
    return { type: ERootActions.moveShipToPort, payload: ship };
}

export function removeShipToPortAction(ship: AbstractShip): IAction<ERootActions, AbstractShip> {
    return { type: ERootActions.removeShipFromPort, payload: ship };
}

