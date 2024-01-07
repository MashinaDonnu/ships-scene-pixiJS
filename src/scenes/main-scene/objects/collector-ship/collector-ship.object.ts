import {AbstractShip, IAbstractShipParams} from "scenes/main-scene/objects/abstract.ship";
import {Graphics} from "pixi.js";
import {PortObject} from "scenes/main-scene/objects/port/port.object";

export interface ICollectorShipObjectParams extends IAbstractShipParams {}

export class CollectorShipObject extends AbstractShip {
    color = '#2dbd56';
    constructor(params: ICollectorShipObjectParams) {
        super(params);
        this.generate()
    }

    generate() {
        this.toEmpty();
    }
}
