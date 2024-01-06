import {AbstractShip} from "scenes/main-scene/objects/abstract.ship";
import {Graphics} from "pixi.js";

export class CollectorShipObject extends AbstractShip {
    constructor() {
        super();
        const m = new Graphics()
        m.beginFill('#fcba03', 1)
        m.drawCircle(0, 0, 10)
        m.endFill()
        m.position.set(200, 200)
        this.addChild(m)
    }
}
