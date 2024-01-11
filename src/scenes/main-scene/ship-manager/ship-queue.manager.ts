import {ShipManager} from "scenes/main-scene/ship-manager/ship.manager";
import {AbstractShip} from "scenes/main-scene/objects/abstract.ship";
import {
    moveShipToAllShipsQueueAction,
    moveToCollectorShipsQueueAction,
    moveToLoadedShipsQueueAction,
    removeShipFromAllShipsQueueAction,
    removeToCollectorShipsQueueAction,
    removeToLoadedShipsQueueAction
} from "store/root/root-action-creators";
import * as TWEEN from "@tweenjs/tween.js";
import {MainScene} from "scenes/main-scene/main.scene";
import {AppStore} from "app";
import {config} from "common/config";

export class ShipQueueManager {
    scene: MainScene;
    store: AppStore;

    constructor(private _shipManager: ShipManager) {
        this.scene = _shipManager.scene;
        this.store = _shipManager.store;
    }

    moveShipToQueue(ship: AbstractShip): void {
        const toRect = { x: ship.x, y: ship.y };
        const shipBodyOffset = config.ship.width / 2;

        if (this._shipManager.isCollectorShip(ship)) {
            toRect.x = this.scene.collectorsShipQueueRect.x + shipBodyOffset;
            toRect.y = this.scene.collectorsShipQueueRect.y;

            this.store.dispatch(moveToCollectorShipsQueueAction(ship), { dispatchEvent: false })
        } else {
            toRect.x = this.scene.loadedShipQueueRect.x +  shipBodyOffset;
            toRect.y = this.scene.loadedShipQueueRect.y;

            this.store.dispatch(moveToLoadedShipsQueueAction(ship), { dispatchEvent: false })
        }

        this.increaseQueue(ship)
        this._shipManager.shipStateManager.setShipState(ship, 'isMovingToQueue')

        const tween = new TWEEN.Tween(ship);
        tween.to(toRect, config.time.shipToPort)
            .onComplete(() => this._shipManager.shipStateManager.setShipState(ship, 'isInQueue'))
            .start();

        this.store.dispatch(moveShipToAllShipsQueueAction(ship))
        this._shipManager.setShipTween(ship, tween)
    }

    checkShipsQueue() {
        if (!this._shipManager.allShipsQueue.length) {
            return;
        }

        const firstShip = this._shipManager.allShipsQueue.find((s) => {
            return !!this._shipManager.getShipStation(s)
        })

        if (!firstShip) {
            return;
        }

        const shipStation = this._shipManager.getShipStation(firstShip);

        if (!shipStation) {
            return;
        }

        this.store.dispatch(removeShipFromAllShipsQueueAction(firstShip));
        this._shipManager.shipStateManager.setShipState(firstShip, 'isMovingToPort')
        shipStation.reserved = true;

        const tween = new TWEEN.Tween(firstShip);
        tween.to({y: this._shipManager.port.entranceCenter}, config.time.shipFromQueueToPort).onComplete(() => {
            this._shipManager.moveShipToPort(firstShip, shipStation, true);
        }).start()

        this._shipManager.setShipTween(firstShip, tween);

        if (this._shipManager.isCollectorShip(firstShip)) {
            this.store.dispatch(removeToCollectorShipsQueueAction(firstShip), { dispatchEvent: false })
        } else {
            this.store.dispatch(removeToLoadedShipsQueueAction(firstShip), { dispatchEvent: false })
        }

        this.decreaseQueue(firstShip);

        const queue = this._shipManager.isCollectorShip(firstShip) ? this._shipManager.collectorShipsQueue: this._shipManager.loadedShipsQueue;
        for (const s of queue) {
            const tween = new TWEEN.Tween(s);
            tween.to({ x: s.x - config.ship.width - this.scene.queueOffsetBetweenShips}, config.time.shipMovingInQueue).start();
            this._shipManager.setShipTween(s, tween);
        }


    }

    increaseQueue(ship: AbstractShip): void {
        if (this._shipManager.isCollectorShip(ship)) {
            this.scene.collectorsShipQueueRect.x += config.ship.width + this.scene.queueOffsetBetweenShips;
        } else {
            this.scene.loadedShipQueueRect.x += config.ship.width + this.scene.queueOffsetBetweenShips;
        }
    }

    decreaseQueue(ship: AbstractShip): void {
        if (this._shipManager.isCollectorShip(ship)) {
            this.scene.collectorsShipQueueRect.x -= config.ship.width + this.scene.queueOffsetBetweenShips;
        } else {
            this.scene.loadedShipQueueRect.x -= config.ship.width + this.scene.queueOffsetBetweenShips;
        }
    }
}
