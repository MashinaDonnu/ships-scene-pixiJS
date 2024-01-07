import {AbstractShip, IAbstractShipParams} from "scenes/main-scene/objects/abstract.ship";
import {PortObject} from "scenes/main-scene/objects/port/port.object";

export interface ILoadedShipObjectParams extends IAbstractShipParams {}

export class LoadedShipObject extends AbstractShip {
    color = '#cc3629';

    constructor(params: ILoadedShipObjectParams) {
        super(params);
        this.generate()
    }

    generate() {
        this.fill();
    }
}
