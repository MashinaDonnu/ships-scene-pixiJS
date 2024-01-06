import {AbstractScene} from "common/abstract.scene";
import {Container, Graphics} from "pixi.js";
import {CollectorShipObject} from "scenes/main-scene/objects/collector-ship/collector-ship.object";
import {SeeObject} from "scenes/main-scene/objects/see/see.object";
import {PortObject} from "scenes/main-scene/objects/port/port.object";

export class MainScene extends AbstractScene {
    see = new SeeObject();
    port = new PortObject();

    constructor() {
        super('main-scene');
        // this.addChild(this.see)
        this.addChild(this.see)
            .addChild(this.port)
        // const s = new CollectorShipObject();
        // this.addChild(s)
    }
}
