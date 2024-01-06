import {AbstractShip} from "scenes/main-scene/objects/abstract.ship";
import {Graphics} from "pixi.js";

export class CollectorShipObject extends AbstractShip {
    color = '#2dbd56';
    constructor() {
        super();
        this.generate()
    }

    generate() {
        super.generate();
        this.toEmpty();
    }
}
