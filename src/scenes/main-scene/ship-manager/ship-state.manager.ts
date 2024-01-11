import {AbstractShip, IAbstractShipStates} from "scenes/main-scene/objects/abstract.ship";
import {ShipManager} from "scenes/main-scene/ship-manager/ship.manager";

export class ShipStateManager {
    constructor(private _shipController: ShipManager) {}

    setShipState(ship: AbstractShip, state: keyof IAbstractShipStates, value: boolean = true): void {
        ship.resetState();
        ship[state] = value;
    }
}
