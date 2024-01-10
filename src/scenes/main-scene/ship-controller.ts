import {MainScene} from "scenes/main-scene/main.scene";
import {AppStore} from "app";
import {AbstractShip} from "scenes/main-scene/objects/abstract.ship";
import {CollectorShipObject} from "scenes/main-scene/objects/collector-ship/collector-ship.object";
import {LoadedShipObject} from "scenes/main-scene/objects/loaded-ship/loaded-ship.object";
import * as TWEEN from "@tweenjs/tween.js";
import {config} from "common/config";
import {
    moveShipToAllShipsQueueAction,
    moveShipToPortAction,
    moveToCollectorShipsQueueAction,
    moveToLoadedShipsQueueAction,
    removeShipFromAllShipsQueueAction,
    removeToCollectorShipsQueueAction,
    removeToLoadedShipsQueueAction
} from "store/root/root-action-creators";
import {PortStationObject} from "scenes/main-scene/objects/port/port-station/port-station.object";
import {PortObject} from "scenes/main-scene/objects/port/port.object";
import {Application} from "pixi.js";
import {ERootActions} from "store/root/root-actions.enum";
import {ShipStateController} from "scenes/main-scene/ship-controller/ship-state.controller";

export class ShipController {
    store: AppStore;
    port: PortObject;
    pixiApp: Application;
    generatedShipsQueue: AbstractShip[] = [];
    collectorShipsQueue: CollectorShipObject[] = [];
    loadedShipsQueue: LoadedShipObject[] = [];
    allShipsQueue: AbstractShip[] = [];
    private _tweenMap = new Map<AbstractShip, Set<TWEEN.Tween<AbstractShip>>>()
    shipStateController = new ShipStateController(this);

    constructor(private scene: MainScene) {
        this.store = scene.app.store;
        this.port = scene.port;
        this.pixiApp = scene.app.pixiApp;
    }

    init(): void {
        this.store.subscribe((state, action) => {
            const { generatedShipsQueue, collectorShipsQueue, loadedShipsQueue, allShipsQueue } = state;
            this.generatedShipsQueue = generatedShipsQueue;
            this.collectorShipsQueue = generatedShipsQueue;
            this.loadedShipsQueue = loadedShipsQueue;
            this.allShipsQueue = allShipsQueue;

            if (action.type === ERootActions.generateShip) {
                console.log('generatedShipsQueue')
                this.startGeneratedShips(action.payload as AbstractShip)
                // this.store.dispatch(moveToCollectorShipsQueueAction(action.payload as AbstractShip), { dispatchEvent: false })
                // for (const generatedShip of generatedShipsQueue) {
                //     this.startGeneratedShips(generatedShip);
                //
                //     if (this.port.isAllStationsOccupied) {
                //         this.store.dispatch(moveToCollectorShipsQueueAction(generatedShip), { dispatchEvent: false });
                //     }
                // }
            }

        });

        this.pixiApp.ticker.add(() => {
            // TWEEN.update()
            for (const [ship, tween] of this._tweenMap) {
                for (const item of tween) {
                    item.update()
                }
            }
        });
    }

    startGeneratedShips(ship: AbstractShip): void {
        if (this._tweenMap.has(ship)) {
            return;
        }

        this.checkShipsQueue();

        const shipStation = this.getShipStation(ship);

        if (!shipStation) {
            this.moveShipToQueue(ship);
            return;
        }

        if (this.scene.port.isAllStationsOccupied) {
           this.moveShipToQueue(ship);
           return;
        }

        this.moveShipToPort(ship, shipStation);
    }

    moveShipToPort(ship: AbstractShip, shipStation: PortStationObject, isFromQueue = false): void {
        const shipIsEnteredToPortX = (this.port.width - this.scene.port.entranceRect.width) - config.ship.width + 10;
        const toRect = { x: shipIsEnteredToPortX, y: this.port.entranceCenter };

        const tween = new TWEEN.Tween(ship);
        tween.to(toRect, isFromQueue ? 1000 : 5000)
            .onStart(() => {
                this.shipStateController.setShipState(ship, 'isMovingToPort')
                shipStation.reserved = true;
            })
            .onComplete(() => {
                if (!ship.isInPort) {
                    ship.isInPort = true;
                    this.store.dispatch(moveShipToPortAction(ship), { dispatchEvent: false });
                    // this.directShipToStation(ship);
                    this.shipStateController.setShipState(ship, 'isMovingToStation')
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

            const isMoveToTop = station.centerX < this.port.entranceCenter
            const tween = new TWEEN.Tween(ship);
            tween.to({ rotation: (isMoveToTop ? Math.PI / 2 : -(Math.PI / 2)) }, 2000)

            const moveToFreeStation = new TWEEN.Tween(ship)
            moveToFreeStation.to({ y: station.centerY }, station.distance);

            const rotateLeft = new TWEEN.Tween(ship);
            rotateLeft.to({ rotation: 0 }, 2000)

            const moveToStation = new TWEEN.Tween(ship);
            moveToStation.to({x: station.rect.width + config.ship.width / 2}, 2000).onComplete(() => {
                if (this.isCollectorShip(ship)) {
                    station.fill()
                }

                this.actionWithLoad(ship, station);
            })


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

            this.moveShipFromPort(ship, station);

        } else {
            station.fill();
            ship.toEmpty()

            this.moveShipFromPort(ship, station);
        }

        this.shipStateController.setShipState(ship, 'isMovingFromStation')
    }

    moveShipFromPort(ship: AbstractShip, station: PortStationObject): void {
        this.clearTween(ship);

        const isMoveToTop = station.centerX < this.port.entranceCenter;

        const tween = new TWEEN.Tween(ship);
        const moveShipFromStation = (this.port.width - this.port.entranceRect.width) - config.ship.width + 10

        tween.to({ x:  moveShipFromStation}, 2000).onComplete(() => station.reserved = false);

        const rotateRight = new TWEEN.Tween(ship);
        rotateRight.to({ rotation: isMoveToTop  ? Math.PI / 2 : 0 }, 2000)

        const moveToEntrance = new TWEEN.Tween(ship);
        moveToEntrance.to({
            y: isMoveToTop ? this.port.entranceCenter - config.ship.width / 1.5 : this.port.entranceCenter + config.ship.width
        }, 2000)

        const rotateLeft = new TWEEN.Tween(ship);
        rotateLeft.to({ rotation: isMoveToTop ? 0 : -(Math.PI / 2) }, 2000)

        const goFromPort = new TWEEN.Tween(ship);
        goFromPort.to({ x: config.width }, 5000).onStart(() => () => {
            this.shipStateController.setShipState(ship, 'isMovingFromPort')
        }).onComplete(() => ship.destroy());

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


    moveShipToQueue(ship: AbstractShip): void {
        const toRect = { x: ship.x, y: ship.y };

        if (this.isCollectorShip(ship)) {
            toRect.x = this.scene.collectorsShipQueueRect.x;
            toRect.y = this.scene.collectorsShipQueueRect.y;

            if (!this._tweenMap.has(ship)) {
                this.scene.collectorsShipQueueRect.x += config.ship.width + this.scene.queueOffsetBetweenShips;
            }

            this.store.dispatch(moveToCollectorShipsQueueAction(ship), { dispatchEvent: false })
        } else {
            toRect.x = this.scene.loadedShipQueueRect.x;
            toRect.y = this.scene.loadedShipQueueRect.y;

            if (!this._tweenMap.has(ship)) {
                this.scene.loadedShipQueueRect.x += config.ship.width + this.scene.queueOffsetBetweenShips;
            }

            this.store.dispatch(moveToLoadedShipsQueueAction(ship), { dispatchEvent: false })
        }

        this.shipStateController.setShipState(ship, 'isMovingToQueue')
        const tween = new TWEEN.Tween(ship);
        tween.to(toRect, 5000).onComplete(() => this.shipStateController.setShipState(ship, 'isInQueue')).start();

        this.store.dispatch(moveShipToAllShipsQueueAction(ship))
        ship.isInQueue = true;
        this.setShipTween(ship, tween)
    }

    checkShipsQueue(): boolean {

        if (this.allShipsQueue.length) {
            const firstShip = this.allShipsQueue.find((s) => {
                return !!this.getShipStation(s)
            })

            if (!firstShip) {
                return false;
            }
            // const firstShip = this.allShipsQueue[0];


            const shipStation = this.getShipStation(firstShip);

            if (!shipStation) {
                return false;
            }

            this.store.dispatch(removeShipFromAllShipsQueueAction(firstShip));

            this.shipStateController.setShipState(firstShip, 'isMovingToPort')
            shipStation.reserved = true;
            const tween = new TWEEN.Tween(firstShip);
            tween.to({y: this.port.entranceCenter}, 1000).onComplete(() => {
                this.moveShipToPort(firstShip, shipStation, true);
            }).start()

            this.setShipTween(firstShip, tween);

            if (this.isCollectorShip(firstShip)) {
                this.store.dispatch(removeToCollectorShipsQueueAction(firstShip), { dispatchEvent: false })
                this.scene.collectorsShipQueueRect.x -= config.ship.width + this.scene.queueOffsetBetweenShips;
                for (let i = 0; i < this.collectorShipsQueue.length; i++) {
                    const shipInQueue = this.collectorShipsQueue[i];
                    const tween = new TWEEN.Tween(shipInQueue);
                    tween.to({x: shipInQueue.x - config.ship.width - this.scene.queueOffsetBetweenShips}, 1000).start();
                    this.setShipTween(shipInQueue, tween);
                }
            } else {
                this.store.dispatch(removeToLoadedShipsQueueAction(firstShip), { dispatchEvent: false })
                this.scene.loadedShipQueueRect.x -= config.ship.width + this.scene.queueOffsetBetweenShips;
                for (let i = 0; i < this.loadedShipsQueue.length; i++) {
                    const shipInQueue = this.loadedShipsQueue[i];
                    const tween = new TWEEN.Tween(shipInQueue);
                    tween.to({x: shipInQueue.x - config.ship.width - this.scene.queueOffsetBetweenShips}, 1000).start();
                    this.setShipTween(shipInQueue, tween);
                }
            }

            return true;
        }

        return false;
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

    startMovingToPortShips() {
    }

    stopMovingToPortShips() {

    }
}
