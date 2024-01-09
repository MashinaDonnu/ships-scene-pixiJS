import {AbstractScene, IAbstractSceneParams} from "common/abstract.scene";
import {SeeObject} from "scenes/main-scene/objects/see/see.object";
import {PortObject} from "scenes/main-scene/objects/port/port.object";
import {config} from "common/config";
import {ERootActions} from "store/root/root-actions.enum";
import {ShipGenerator} from "scenes/main-scene/ship-generator";
import {ShipController} from "scenes/main-scene/ship-controller";
import {IRect} from "common/interfaces/rect.interface";

export interface IMainSceneParams extends IAbstractSceneParams {}

export class MainScene extends AbstractScene {
    see = new SeeObject({ name: 'see', scene: this });
    port = new PortObject({ name: 'port', scene: this });
    queueOffsetBetweenShips = 10;
    collectorsShipQueueRect: IRect;
    loadedShipQueueRect: IRect;

    constructor(params: IMainSceneParams) {
        super(params);

        this.addChild(this.see)
            .addChild(this.port)

        this.collectorsShipQueueRect = {
            x: this.port.width + this.queueOffsetBetweenShips,
            y: this.port.entranceRect.y - config.ship.height,
            width: 0
        }

        this.loadedShipQueueRect = {
            x: this.port.width + this.queueOffsetBetweenShips,
            y: this.port.entranceRect.y + this.port.entranceRect.height,
            width: 0
        }

        const store = this.app.store;


        store.dispatch({type: ERootActions.test})


        const shipGenerator = new ShipGenerator(this);
        const shipController = new ShipController(this);

        shipController.init();

        // setTimeout(() => {
        //     shipGenerator.generate();
        // }, 2000)
        //
        // setTimeout(() => {
        //     shipGenerator.generate();
        // }, 10000)
        shipGenerator.generate();
        // const ship = shipGenerator.generate();
        // this.addChild(ship)
        //
        //
        //
        // const coords = { x: config.width, y: ship.position.y };
        // const tween = new Tween(coords)
        // tween.to({ x: this.port.width, y: ship.position.y }, 3000).onUpdate(() => {
        //     console.log('onUpdate')
        //     ship.position.x = coords.x;
        //     ship.position.y = coords.y;
        // })
        //
        // params.app.pixiApp.ticker.add(() => {
        //     tween.update()
        // })

    }
}
