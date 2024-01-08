import {MainScene} from "scenes/main-scene/main.scene";
import {AppStore} from "app";
import {AbstractShip} from "scenes/main-scene/objects/abstract.ship";
import {CollectorShipObject} from "scenes/main-scene/objects/collector-ship/collector-ship.object";
import {LoadedShipObject} from "scenes/main-scene/objects/loaded-ship/loaded-ship.object";
import {IRect} from "common/interfaces/rect.interface";
import * as TWEEN from "@tweenjs/tween.js";
import {config} from "common/config";
import {moveToCollectorShipsQueueAction} from "store/root/root-action-creators";

export class ShipController {
    store: AppStore
    generatedShipsQueue: AbstractShip[] = [];
    collectorShipsQueue: CollectorShipObject[] = [];
    loadedShipsQueue: LoadedShipObject[] = [];
    private _tweenMap = new Map<AbstractShip, TWEEN.Tween<any>>()

    constructor(private scene: MainScene) {
        this.store = scene.app.store;
    }

    init(): void {
        this.store.subscribe((state, action) => {
            const { generatedShipsQueue, collectorShipsQueue, loadedShipsQueue } = state;
            this.generatedShipsQueue = generatedShipsQueue;
            this.collectorShipsQueue = generatedShipsQueue;
            this.loadedShipsQueue = loadedShipsQueue;

            for (const generatedShip of generatedShipsQueue) {
                this.startGeneratedShips(generatedShip);

                if (this.scene.port.isAllPiersOccupied) {
                    this.store.dispatch(moveToCollectorShipsQueueAction(generatedShip), { dispatchEvent: false });
                }
            }
        });

        this.scene.app.pixiApp.ticker.add(() => {
            for (const [ship, tween] of this._tweenMap) {
                tween.update();
            }
        })
    }

    startGeneratedShips(ship: AbstractShip): void {
        const rect: IRect = { x: config.width, y: ship.position.y };
        const toRect = { x: this.scene.port.width - this.scene.port.entranceRect.width, y: ship.position.y }

        if (this.scene.port.isAllPiersOccupied) {
            toRect.x = this.scene.loadedShipQueueRect.x;
            toRect.y = this.scene.loadedShipQueueRect.y;

            if (!this._tweenMap.has(ship)) {
                this.scene.loadedShipQueueRect.x += config.ship.width + this.scene.queueOffsetBetweenShips;
            }
        }

        const tween = new TWEEN.Tween(rect);
        tween.to(toRect, 3000).onUpdate(() => {
            // console.log('onUpdate')
            ship.position.x = rect.x;
            ship.position.y = rect.y;
        }).start()

        if (!this._tweenMap.has(ship)) {
            this._tweenMap.set(ship, tween)
        }
    }

    moveShipToQueue(ship: AbstractShip) {

    }
}
