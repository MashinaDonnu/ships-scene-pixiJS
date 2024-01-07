import {MainScene} from "scenes/main-scene/main.scene";
import {AppStore} from "app";
import {AbstractShip} from "scenes/main-scene/objects/abstract.ship";
import {CollectorShipObject} from "scenes/main-scene/objects/collector-ship/collector-ship.object";
import {LoadedShipObject} from "scenes/main-scene/objects/loaded-ship/loaded-ship.object";
import {IRect} from "common/interfaces/rect.interface";
import * as TWEEN from "@tweenjs/tween.js";
import {config} from "common/config";

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
        this.store.subscribe((state) => {
            const { generatedShipsQueue, collectorShipsQueue, loadedShipsQueue } = state;
            this.generatedShipsQueue = generatedShipsQueue;
            this.collectorShipsQueue = generatedShipsQueue;
            this.loadedShipsQueue = loadedShipsQueue;
            console.log('dispatch')
            for (const generatedShip of generatedShipsQueue) {
                this.startGeneratedShips(generatedShip);
            }
        });


        // const tween = new Tween(coords);
        // tween.to({ x: this.scene.port.width, y: ship.position.y }, 3000).onUpdate(() => {
        //     console.log('onUpdate')
        //     ship.position.x = coords.x;
        //     ship.position.y = coords.y;
        // })
        //
        this.scene.app.pixiApp.ticker.add(() => {
            for (const [ship, tween] of this._tweenMap) {
                tween.update();
            }
        })

        setTimeout(() => {
            console.log('======', this._tweenMap.size)
            for (const tween of this._tweenMap) {
                console.log(tween)
            }
        }, 5000)
    }

    startGeneratedShips(ship: AbstractShip): void {
        const rect: IRect = { x: config.width, y: ship.position.y };
        const tween = new TWEEN.Tween(rect);
        tween.to({ x: this.scene.port.width, y: ship.position.y }, 3000).onUpdate(() => {
            // console.log('onUpdate')
            ship.position.x = rect.x;
            ship.position.y = rect.y;
        }).start()

        if (!this._tweenMap.has(ship)) {
            this._tweenMap.set(ship, tween)
        }
    }
}
