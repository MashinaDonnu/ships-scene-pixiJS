import {MainScene} from "scenes/main-scene/main.scene";
import {AppStore} from "app";
import {AbstractShip} from "scenes/main-scene/objects/abstract.ship";
import {CollectorShipObject} from "scenes/main-scene/objects/collector-ship/collector-ship.object";
import {LoadedShipObject} from "scenes/main-scene/objects/loaded-ship/loaded-ship.object";
import * as TWEEN from "@tweenjs/tween.js";
import {config} from "common/config";
import {moveShipToPortAction} from "store/root/root-action-creators";
import {PortStationObject} from "scenes/main-scene/objects/port/port-station/port-station.object";
import {PortObject} from "scenes/main-scene/objects/port/port.object";
import {Application} from "pixi.js";
import {ERootActions} from "store/root/root-actions.enum";
import {ShipStateManager} from "scenes/main-scene/ship-manager/ship-state.manager";
import {IAction} from "store/action.interface";
import {ShipQueueManager} from "scenes/main-scene/ship-manager/ship-queue.manager";
import {IStoreSubscribe} from "store/store";
import {TickerCallback} from "@pixi/ticker/lib/Ticker";

export class ShipManager {
    store: AppStore;
    port: PortObject;
    pixiApp: Application;
    generatedShipsQueue: AbstractShip[] = [];
    collectorShipsQueue: CollectorShipObject[] = [];
    loadedShipsQueue: LoadedShipObject[] = [];
    allShipsQueue: AbstractShip[] = [];

    shipStateManager: ShipStateManager;
    shipQueueManager: ShipQueueManager;

    private _ticker: TickerCallback<null>;
    private _tweenMap = new Map<AbstractShip, Set<TWEEN.Tween<AbstractShip>>>()
    private _storeSubscription: IStoreSubscribe;

    constructor(public scene: MainScene) {
        this.store = scene.app.store;
        this.port = scene.port;
        this.pixiApp = scene.app.pixiApp;
        this.shipStateManager = new ShipStateManager(this);
        this.shipQueueManager = new ShipQueueManager(this);
    }

    init(): void {
        this.store.subscribe((state, action: IAction<ERootActions, AbstractShip>) => {
            const { generatedShipsQueue, collectorShipsQueue, loadedShipsQueue, allShipsQueue } = state;
            this.generatedShipsQueue = generatedShipsQueue;
            this.collectorShipsQueue = collectorShipsQueue;
            this.loadedShipsQueue = loadedShipsQueue;
            this.allShipsQueue = allShipsQueue;

            if (action.type === ERootActions.generateShip) {
                this.startShip(action.payload)
            }
        });

        const ticker = () => {
            // TWEEN.update()
            for (const [ship, tween] of this._tweenMap) {
                for (const item of tween) {
                    item.update()
                }
            }
        }

        this._ticker = ticker;
        this.pixiApp.ticker.add(ticker);
    }

    startShip(ship: AbstractShip): void {
        if (this._tweenMap.has(ship)) {
            return;
        }

        this.shipQueueManager.checkShipsQueue();

        const shipStation = this.getShipStation(ship);

        if (!shipStation) {
            this.shipQueueManager.moveShipToQueue(ship);
            return;
        }

        this.moveShipToPort(ship, shipStation);
    }

    moveShipToPort(ship: AbstractShip, shipStation: PortStationObject, isFromQueue = false): void {
        const shipIsEnteredToPortX = (this.port.width - this.scene.port.entranceRect.width) - config.ship.width + 10;
        const toRect = { x: shipIsEnteredToPortX, y: this.port.entranceCenter };

        const tween = new TWEEN.Tween(ship);
        tween.to(toRect, isFromQueue ? config.time.shipFromQueueToPort : config.time.shipToPort)
            .onStart(() => {
                this.shipStateManager.setShipState(ship, 'isMovingToPort')
                shipStation.reserved = true;
            })
            .onComplete(() => {
                if (!ship.isInPort) {
                    ship.isInPort = true;
                    this.store.dispatch(moveShipToPortAction(ship), { dispatchEvent: false });
                    this.shipStateManager.setShipState(ship, 'isMovingToStation')
                    this.moveToStation(ship, shipStation);
                }
            }).start()

        this.setShipTween(ship, tween);
    }

    getShipStation(ship: AbstractShip): PortStationObject {
        let shipStation: PortStationObject;

        if (this.isCollectorShip(ship)) {
            shipStation = this.findLoadedStation();
        } else {
            shipStation = this.findFreePortStation();
        }

        return shipStation;
    }

    findFreePortStation(): PortStationObject {
        return this.scene.port.stations.find(s => !s.isFilled && !s.reserved)
    }

    findLoadedStation(): PortStationObject {
        return this.scene.port.stations.find(s => s.isFilled && !s.reserved)
    }

    moveToStation(ship: AbstractShip, station: PortStationObject): void {

            const isMoveToTop = station.centerX < this.port.entranceCenter;
            const tween = new TWEEN.Tween(ship);
            tween.to({ rotation: (isMoveToTop ? Math.PI / 2 : -(Math.PI / 2)) }, config.time.shipToStationRotation);

            const moveToFreeStation = new TWEEN.Tween(ship)
            // moveToFreeStation.to({ y: station.centerY }, station.distance);
            moveToFreeStation.to({ y: station.centerY }, config.time.shipToStation);

            const rotateLeft = new TWEEN.Tween(ship);
            rotateLeft.to({ rotation: 0 }, config.time.shipToStationRotation)

            const moveToStation = new TWEEN.Tween(ship);
            moveToStation.to({
                x: station.rect.width + config.ship.width / 2 + config.station.borderWidth
            }, config.time.shipToStation).onComplete(() => this.actionWithLoad(ship, station))

            if (isMoveToTop) {
                tween.chain(moveToFreeStation)
                moveToFreeStation.chain(rotateLeft)
                rotateLeft.chain(moveToStation)
            } else {
                tween.chain(moveToFreeStation)
                moveToFreeStation.chain(rotateLeft)
                rotateLeft.chain(moveToStation)
            }

            tween.start()

            this.setShipTween(ship, tween)
            this.setShipTween(ship, moveToFreeStation)
            this.setShipTween(ship, rotateLeft)
            this.setShipTween(ship, moveToStation)
    }

    actionWithLoad(ship: AbstractShip, station: PortStationObject): void {
        if (ship instanceof CollectorShipObject) {
            station.toEmpty();
            ship.fill();
        } else {
            station.fill();
            ship.toEmpty()
        }

        this.moveShipFromPort(ship, station);
        this.shipStateManager.setShipState(ship, 'isMovingFromStation')
    }

    moveShipFromPort(ship: AbstractShip, station: PortStationObject): void {
        this.clearTween(ship);

        const isMoveToTop = station.centerX < this.port.entranceCenter;

        const tween = new TWEEN.Tween(ship);
        const moveShipFromStation = (this.port.width - this.port.entranceRect.width) - config.ship.width + 10

        tween.to({ x:  moveShipFromStation}, config.time.shipFromStation).onComplete(() => station.reserved = false);

        const rotateRight = new TWEEN.Tween(ship);
        rotateRight.to({ rotation: isMoveToTop  ? Math.PI / 2 : 0 }, config.time.shipToStationRotation)

        const moveToEntrance = new TWEEN.Tween(ship);
        moveToEntrance.to({
            y: isMoveToTop ? this.port.entranceCenter - config.ship.width / 1.5 : this.port.entranceCenter + config.ship.width
        }, config.time.shipToPortEntrance);

        const rotateLeft = new TWEEN.Tween(ship);
        rotateLeft.to({ rotation: isMoveToTop ? 0 : -(Math.PI / 2) }, config.time.shipToStationRotation)

        const goFromPort = new TWEEN.Tween(ship);
        goFromPort.to({ x: config.width }, config.time.shipFromPort).onStart(() => () => {
            this.shipStateManager.setShipState(ship, 'isMovingFromPort')
        }).onComplete(() => {
            ship.destroy();
            this._tweenMap.delete(ship);
        });

        if (isMoveToTop) {
            tween.chain(rotateRight)
            rotateRight.chain(moveToEntrance)
            moveToEntrance.chain(rotateLeft)
            rotateLeft.chain(goFromPort)
        } else {
            tween.chain(rotateLeft)
            rotateLeft.chain(moveToEntrance)
            moveToEntrance.chain(rotateRight)
            rotateRight.chain(goFromPort)
        }

        tween.start();

        this.setShipTween(ship, tween)
        this.setShipTween(ship, rotateRight)
        this.setShipTween(ship, moveToEntrance)
        this.setShipTween(ship, rotateLeft)
        this.setShipTween(ship, goFromPort)
    }

    setShipTween(ship: AbstractShip, tween: TWEEN.Tween<AbstractShip>): void {
        if (!this._tweenMap.has(ship)) {
            this._tweenMap.set(ship, new Set())
        }

        const set = this._tweenMap.get(ship);
        set.add(tween)
    }

    getShipTween(ship: AbstractShip): Set<TWEEN.Tween<AbstractShip>> {
        return this._tweenMap.get(ship);
    }

    clearTween(ship: AbstractShip): void {
        this._tweenMap.get(ship).clear();
    }

    isCollectorShip(ship: AbstractShip): boolean {
        return ship instanceof CollectorShipObject;
    }

    destroy(): void {
        this._storeSubscription?.unsubscribe();
        this.pixiApp.ticker.remove(this._ticker);
    }
}
