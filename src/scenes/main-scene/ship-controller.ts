import {MainScene} from "scenes/main-scene/main.scene";
import {AppStore} from "app";
import {AbstractShip} from "scenes/main-scene/objects/abstract.ship";
import {CollectorShipObject} from "scenes/main-scene/objects/collector-ship/collector-ship.object";
import {LoadedShipObject} from "scenes/main-scene/objects/loaded-ship/loaded-ship.object";
import * as TWEEN from "@tweenjs/tween.js";
import {config} from "common/config";
import {moveShipToPortAction, moveToCollectorShipsQueueAction} from "store/root/root-action-creators";
import {PortStationObject} from "scenes/main-scene/objects/port/port-station/port-station.object";

export class ShipController {
    store: AppStore
    generatedShipsQueue: AbstractShip[] = [];
    collectorShipsQueue: CollectorShipObject[] = [];
    loadedShipsQueue: LoadedShipObject[] = [];
    private _tweenMap = new Map<AbstractShip, Set<TWEEN.Tween<AbstractShip>>>()

    constructor(private scene: MainScene) {
        this.store = scene.app.store;
    }

    init(): void {
        this.store.subscribe((state, action) => {
            const { generatedShipsQueue, collectorShipsQueue, loadedShipsQueue } = state;
            this.generatedShipsQueue = generatedShipsQueue;
            this.collectorShipsQueue = generatedShipsQueue;
            this.loadedShipsQueue = loadedShipsQueue;

            console.log('generatedShipsQueue', generatedShipsQueue)
            for (const generatedShip of generatedShipsQueue) {
                this.startGeneratedShips(generatedShip);

                if (this.scene.port.isAllPiersOccupied) {
                    this.store.dispatch(moveToCollectorShipsQueueAction(generatedShip), { dispatchEvent: false });
                }
            }
        });

        this.scene.app.pixiApp.ticker.add(() => {
            for (const [ship, tween] of this._tweenMap) {
                for (const item of tween) {
                    item.update()
                }
            }
        })
    }

    startGeneratedShips(ship: AbstractShip): void {
        if (this._tweenMap.has(ship)) {
            return;
        }
        const toRect = { x: (this.scene.port.width - this.scene.port.entranceRect.width) - config.ship.width + 10, y: ship.position.y }
        console.log('toRect', toRect)
        if (this.scene.port.isAllPiersOccupied) {
            toRect.x = this.scene.loadedShipQueueRect.x;
            toRect.y = this.scene.loadedShipQueueRect.y;

            if (!this._tweenMap.has(ship)) {
                this.scene.loadedShipQueueRect.x += config.ship.width + this.scene.queueOffsetBetweenShips;
            }
        }

        const tween = new TWEEN.Tween(ship);
        tween.to(toRect, 5000).onComplete(() => {
            if (!ship.isInPort) {
                ship.isInPort = true;
                this.store.dispatch(moveShipToPortAction(ship), { dispatchEvent: false });
                this.directShipToStation(ship);
            }
        })
            .start()

        this.setShipTween(ship, tween);
    }

    findFreePortStation(): PortStationObject {
        return this.scene.port.stations.find(s => !s.isFilled)
    }

    findLoadedStation(): PortStationObject {
        return this.scene.port.stations.find(s => s.isFilled)
    }

    directShipToStation(ship: AbstractShip) {
        if (ship instanceof CollectorShipObject) {
            this.moveToLoadedStation(ship);
        } else {
            this.moveToFreeStation(ship);
        }
    }

    moveToLoadedStation(ship: AbstractShip): void {
        const loadedStation = this.findLoadedStation();
        if (loadedStation) {
            this.moveToStation(ship, loadedStation)
        }
    }

    moveToFreeStation(ship: AbstractShip): void {
        const freeStation = this.findFreePortStation();
        if (freeStation) {
            this.moveToStation(ship, freeStation)
        }
    }

    moveToStation(ship: AbstractShip, station: PortStationObject): void {

            if (ship instanceof CollectorShipObject) {
                station.isFilled = false;
            } else {
                station.isFilled = true;
            }

            const portCenterX = config.height / 2;
            const stationCenterX = station.rect.y + station.height / 2;

            const tween = new TWEEN.Tween(ship);
            tween.to({rotation: ( stationCenterX < portCenterX ? Math.PI / 2 : -(Math.PI / 2))}, 2000)

            const moveToFreeStation = new TWEEN.Tween(ship)
            moveToFreeStation.to({ y: station.rect.y + station.rect.height / 2 }, station.distance);

            const rotateLeft = new TWEEN.Tween(ship);
            rotateLeft.to({ rotation: 0 }, 2000)

            const moveToStation = new TWEEN.Tween(ship);
            moveToStation.to({x: station.rect.width + config.ship.width / 2}, 2000).onComplete(() => {
                if (ship instanceof CollectorShipObject) {
                    station.fill()
                }

                this.actionWithLoad(ship, station);
            })


            if (stationCenterX < portCenterX) {
                tween.chain(moveToFreeStation)
                moveToFreeStation.chain(rotateLeft)
                rotateLeft.chain(moveToStation)
            } else {
                tween.chain(moveToFreeStation)
                moveToFreeStation.chain(rotateLeft)
                rotateLeft.chain(moveToStation)
            }



            tween.start()
            // moveToFreeStation.start()
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
    }

    moveShipFromPort(ship: AbstractShip, station: PortStationObject): void {
        this.clearTween(ship);
        const portCenterX = config.height / 2;
        const stationCenterX = station.rect.y + station.height / 2;

        const tween = new TWEEN.Tween(ship);
        tween.to({ x: (this.scene.port.width - this.scene.port.entranceRect.width) - config.ship.width + 10 }, 2000);

        const rotateRight = new TWEEN.Tween(ship);
        rotateRight.to({ rotation:  stationCenterX < portCenterX ? Math.PI / 2 : 0 }, 2000)

        const moveToEntrance = new TWEEN.Tween(ship);
        moveToEntrance.to({
            y: stationCenterX < portCenterX ? this.scene.shipGenerator.getPortEntranceY() - config.ship.width / 1.5 : this.scene.shipGenerator.getPortEntranceY() + config.ship.width
        }, 2000)

        const rotateLeft = new TWEEN.Tween(ship);
        rotateLeft.to({ rotation: stationCenterX < portCenterX ? 0 : -(Math.PI / 2) }, 2000)

        const goFromPort = new TWEEN.Tween(ship);
        goFromPort.to({ x: config.width }, 5000)

        if (stationCenterX < portCenterX) {
            tween.chain(rotateRight)
            rotateRight.chain(moveToEntrance)
            moveToEntrance.chain(rotateLeft)
            rotateLeft.chain(goFromPort)
        } else {
            tween.chain(rotateLeft)
            rotateLeft.chain(moveToEntrance)
            moveToEntrance.chain(rotateRight)
            rotateRight.chain(goFromPort)
            // rotateRight
            //     .chain(moveToEntrance)
            // moveToEntrance.chain(rotateRight)
            // rotateLeft.chain(goFromPort)
        }

        tween.start();


        this.setShipTween(ship, tween)
        this.setShipTween(ship, rotateRight)
        this.setShipTween(ship, moveToEntrance)
        this.setShipTween(ship, rotateLeft)
        this.setShipTween(ship, goFromPort)
    }

    moveShipToQueue(ship: AbstractShip) {

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
}
