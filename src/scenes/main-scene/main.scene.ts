import {AbstractScene, IAbstractSceneParams} from "common/abstract.scene";
import {CollectorShipObject} from "scenes/main-scene/objects/collector-ship/collector-ship.object";
import {SeeObject} from "scenes/main-scene/objects/see/see.object";
import {PortObject} from "scenes/main-scene/objects/port/port.object";
import {Tween} from "@tweenjs/tween.js";
import {config} from "common/config";

export interface IMainSceneParams extends IAbstractSceneParams {}

export class MainScene extends AbstractScene {
    see = new SeeObject({ name: 'see', scene: this });
    port = new PortObject({ name: 'port', scene: this });

    constructor(params: IMainSceneParams) {
        super(params);
        // this.addChild(this.see)
        this.addChild(this.see)
            .addChild(this.port)

        const collectorShip = new CollectorShipObject({
            name: 'collector-ship',
            scene: this,
            rect: {
                x: 400,
                y: 400
            },
        });

        this.addChild(collectorShip)

        const coords = { x: config.width, y: 200 };
        const tween = new Tween(coords)
        tween.to({ x: 700, y: 200 }, 3000).onUpdate(() => {
            console.log('onUpdate')
            collectorShip.position.x = coords.x;
            collectorShip.position.y = coords.y;
        })

        params.app.pixiApp.ticker.add(() => {
            tween.update()
        })
    }
}
