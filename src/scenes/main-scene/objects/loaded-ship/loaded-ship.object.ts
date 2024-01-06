import {AbstractShip} from "scenes/main-scene/objects/abstract.ship";

export class LoadedShipObject extends AbstractShip {
    color: '#cc3629';
    constructor() {
        super();
        this.generate()
    }

    generate() {
        super.generate();
        this.fill();
    }
}
