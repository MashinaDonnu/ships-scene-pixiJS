import {AbstractShip, IAbstractShipParams} from "scenes/main-scene/objects/abstract.ship";
import {PortObject} from "scenes/main-scene/objects/port/port.object";
import {config} from "common/config";

export interface ILoadedShipObjectParams extends IAbstractShipParams {}

export class LoadedShipObject extends AbstractShip {
    color = config.colors.red;

    constructor(params: ILoadedShipObjectParams) {
        super(params);
        this.generate()
    }

    generate() {
        this.fill();
    }
}
