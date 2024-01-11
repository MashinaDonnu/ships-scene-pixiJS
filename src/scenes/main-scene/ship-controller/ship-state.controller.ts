import {AbstractShip, IAbstractShipStates} from "scenes/main-scene/objects/abstract.ship";
import {ShipController} from "scenes/main-scene/ship-controller/ship-controller";

export class ShipStateController {
    constructor(private _shipController: ShipController) {}

    setShipState(ship: AbstractShip, state: keyof IAbstractShipStates, value: boolean = true): void {
        ship.resetState();
        ship[state] = value;
    }
}
