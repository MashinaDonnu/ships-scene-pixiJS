import {AbstractScene} from "common/abstract.scene";
import {CollectorShipObject} from "scenes/main-scene/objects/collector-ship/collector-ship.object";
import {SeeObject} from "scenes/main-scene/objects/see/see.object";
import {PortObject} from "scenes/main-scene/objects/port/port.object";
import {ISceneParams} from "common/interfaces/scene-params.interface";

export class MainScene extends AbstractScene {
    see = new SeeObject();
    port = new PortObject();

    constructor(params: ISceneParams) {
        super('main-scene');
        // this.addChild(this.see)
        this.addChild(this.see)
            .addChild(this.port)
        const collectorShip = new CollectorShipObject();
        this.addChild(collectorShip)


    }
}
