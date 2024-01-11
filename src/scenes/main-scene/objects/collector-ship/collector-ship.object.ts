import {AbstractShip, IAbstractShipParams} from "scenes/main-scene/objects/abstract.ship";
import {Graphics} from "pixi.js";
import {PortObject} from "scenes/main-scene/objects/port/port.object";
import {config} from "common/config";

export interface ICollectorShipObjectParams extends IAbstractShipParams {}

export class CollectorShipObject extends AbstractShip {
    color = config.colors.green;

    constructor(params: ICollectorShipObjectParams) {
        super(params);
        this.generate()
    }

    generate() {
        this.toEmpty();
    }
}
