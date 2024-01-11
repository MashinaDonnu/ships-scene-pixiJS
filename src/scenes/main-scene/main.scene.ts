import {AbstractScene, IAbstractSceneParams} from "common/abstract.scene";
import {SeeObject} from "scenes/main-scene/objects/see/see.object";
import {PortObject} from "scenes/main-scene/objects/port/port.object";
import {config} from "common/config";
import {ERootActions} from "store/root/root-actions.enum";
import {ShipGenerator} from "scenes/main-scene/ship-generator";
import {ShipController} from "scenes/main-scene/ship-controller/ship-controller";
import {IRect} from "common/interfaces/rect.interface";

export interface IMainSceneParams extends IAbstractSceneParams {}

export class MainScene extends AbstractScene {
    see = new SeeObject({ name: 'see', scene: this });
    port = new PortObject({ name: 'port', scene: this });
    queueOffsetBetweenShips = 10;
    collectorsShipQueueRect: IRect;
    loadedShipQueueRect: IRect;

    shipGenerator: ShipGenerator;
    private _intervalId: NodeJS.Timeout;

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

        this.start();
    }

    start(): void {
        const shipGenerator = new ShipGenerator(this);
        this.shipGenerator = shipGenerator;
        const shipController = new ShipController(this);

        shipController.init();

        this._intervalId = setInterval(() => {
            shipGenerator.generate();
        }, config.time.shipGeneration)

        shipGenerator.generate();
    }

    destroy() {
        clearInterval(this._intervalId);
    }
}
