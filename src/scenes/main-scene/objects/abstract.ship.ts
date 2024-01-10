import {AbstractObject, IAbstractObjectParams} from "common/abstract.object";
import {Graphics} from "pixi.js";
import {IRect} from "common/interfaces/rect.interface";
import {config} from "common/config";

export interface IAbstractShipParams extends IAbstractObjectParams {
    rect: IRect;
}

export interface IAbstractShipStates {
    isMovingToPort: boolean;
    isMovingToQueue: boolean;
    isMovingFromQueue: boolean;
    isMovingToStation: boolean;
    isMovingFromStation: boolean;
    isMovingFromPort: boolean;
    isInQueue: boolean;
    isInPort: boolean;
}

export abstract class AbstractShip extends AbstractObject implements IAbstractShipStates {
    isInPort = false;
    isMovingToPort = false;
    isMovingToQueue = false;
    isMovingFromQueue = false;
    isMovingToStation = false;
    isMovingFromStation = false;
    isMovingFromPort = false;
    isInQueue = false;
    shipWidth = config.ship.width;
    shipHeight = config.ship.height;
    color = '#000'
    borderWidth = 3;
    private _view: Graphics

    protected constructor(private params: IAbstractShipParams) {
        super(params);
        const { x, y } = params.rect;
        this.width = this.shipWidth;
        this.height = this.shipHeight;
        this.position.x = x
        this.position.y = y
    }

    abstract generate(): void;

    fill() {
        this.removeChild(this._view);
        this._view = new Graphics();
        this._view.lineStyle(this.borderWidth, this.color);
        this._view.beginFill(this.color, 1)
        this._view.drawRect(0, 0, this.shipWidth, this.shipHeight)
        this._view.endFill()
        this._view.pivot.set(this.shipWidth / 2, this.shipHeight / 2)
        this.addChild(this._view)
    }

    toEmpty() {
        this.removeChild(this._view);
        this._view = new Graphics();
        this._view.lineStyle(this.borderWidth, this.color);
        this._view.drawRect(0, 0, this.shipWidth, this.shipHeight);
        this._view.pivot.set(this.shipWidth / 2, this.shipHeight / 2)
        this.addChild(this._view);
    }

    start() {

    }

    stop() {

    }

    destroy() {

    }

    get view() {
        return this._view;
    }

    resetState() {
        this.isInPort = false;
        this.isMovingToPort = false;
        this.isMovingToQueue = false;
        this.isMovingFromQueue = false;
        this.isMovingToStation = false;
        this.isMovingFromStation = false;
        this.isMovingFromPort = false;
        this.isInQueue = false;
    }
}
