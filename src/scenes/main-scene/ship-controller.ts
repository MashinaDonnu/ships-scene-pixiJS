import {MainScene} from "scenes/main-scene/main.scene";
import {AppStore} from "app";
import {AbstractShip} from "scenes/main-scene/objects/abstract.ship";
import {CollectorShipObject} from "scenes/main-scene/objects/collector-ship/collector-ship.object";
import {LoadedShipObject} from "scenes/main-scene/objects/loaded-ship/loaded-ship.object";
import {IRect} from "common/interfaces/rect.interface";
import * as TWEEN from "@tweenjs/tween.js";
import {config} from "common/config";
import {moveShipToPortAction, moveToCollectorShipsQueueAction} from "store/root/root-action-creators";
import {checkObjectsCollision} from "common/helpers/check-objects-collision";
import {PortStationObject} from "scenes/main-scene/objects/port/port-station/port-station.object";

export class ShipController {
    store: AppStore
    generatedShipsQueue: AbstractShip[] = [];
    collectorShipsQueue: CollectorShipObject[] = [];
    loadedShipsQueue: LoadedShipObject[] = [];
    private _tweenMap = new Map<AbstractShip, TWEEN.Tween<IRect>>()

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
        const toRect = { x: (this.scene.port.width - this.scene.port.entranceRect.width) - config.ship.height + 10, y: ship.position.y }

        if (this.scene.port.isAllPiersOccupied) {
            toRect.x = this.scene.loadedShipQueueRect.x;
            toRect.y = this.scene.loadedShipQueueRect.y;

            if (!this._tweenMap.has(ship)) {
                this.scene.loadedShipQueueRect.x += config.ship.width + this.scene.queueOffsetBetweenShips;
            }
        }

        const tween = new TWEEN.Tween(rect);
        tween.to(toRect, 3000).onUpdate(() => {
            ship.position.x = rect.x;
            ship.position.y = rect.y;

            if (checkObjectsCollision(ship, this.scene.port.entrance) && this.scene.port.entranceRect.x + 5 >= ship.position.x) {

            }
        }).onComplete(() => {
            if (!ship.isInPort) {
                ship.isInPort = true;
                this.store.dispatch(moveShipToPortAction(ship), { dispatchEvent: false });
                this.moveToFreeStation(ship);
            }
        })
            .start()

        if (!this._tweenMap.has(ship)) {
            this._tweenMap.set(ship, tween)
        }
    }

    findFreePortStation(): PortStationObject {
        return this.scene.port.stations.find(s => !s.isFilled)
    }

    moveToFreeStation(ship: AbstractShip): void {
        const freeStation = this.findFreePortStation();
        if (freeStation) {
            console.log(freeStation)
             const tween = this._tweenMap.get(ship);
             ship.rotation = Math.PI / 2
        }
    }

    moveShipToQueue(ship: AbstractShip) {

    }
}
