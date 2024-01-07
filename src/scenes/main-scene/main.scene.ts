import {AbstractScene, IAbstractSceneParams} from "common/abstract.scene";
import {CollectorShipObject} from "scenes/main-scene/objects/collector-ship/collector-ship.object";
import {SeeObject} from "scenes/main-scene/objects/see/see.object";
import {PortObject} from "scenes/main-scene/objects/port/port.object";
import {Tween} from "@tweenjs/tween.js";
import {config} from "common/config";
import {ERootActions} from "store/root/root-actions.enum";
import {ShipGenerator} from "scenes/main-scene/ship-generator";

export interface IMainSceneParams extends IAbstractSceneParams {}

export class MainScene extends AbstractScene {
    see = new SeeObject({ name: 'see', scene: this });
    port = new PortObject({ name: 'port', scene: this });

    constructor(params: IMainSceneParams) {
        super(params);
        // this.addChild(this.see)
        this.addChild(this.see)
            .addChild(this.port)

        // const collectorShip = new CollectorShipObject({
        //     name: 'collector-ship',
        //     scene: this,
        //     rect: {
        //         x: 400,
        //         y: 400
        //     },
        // });
        // this.addChild(collectorShip)



        const store = this.app.store;

        console.log('store', store.getState())

        store.subscribe((updated: any) => {
            console.log('updated', updated)
        })

        store.dispatch({type: ERootActions.test})


        const shipGenerator = new ShipGenerator(this);
        const ship = shipGenerator.generate();
        this.addChild(ship)



        const coords = { x: config.width, y: ship.position.y };
        const tween = new Tween(coords)
        tween.to({ x: this.port.width, y: ship.position.y }, 3000).onUpdate(() => {
            console.log('onUpdate')
            ship.position.x = coords.x;
            ship.position.y = coords.y;
        })

        params.app.pixiApp.ticker.add(() => {
            tween.update()
        })

    }
}
