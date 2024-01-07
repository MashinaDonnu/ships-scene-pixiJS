import {AbstractObject, IAbstractObjectParams} from "common/abstract.object";
import {Graphics} from "pixi.js";
import {PortObject} from "scenes/main-scene/objects/port/port.object";
import {IRect} from "common/interfaces/rect.interface";

export interface IAbstractShipParams extends IAbstractObjectParams {
    rect: IRect;
}

export abstract class AbstractShip extends AbstractObject {
    isFilled = false;
    shipWidth = 150;
    shipHeight = 40;
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
        const m = new Graphics()
        m.beginFill(this.color, 1)
        m.drawRect(0, 0, this.shipWidth, this.shipHeight)
        m.endFill()
        this.addChild(m)
    }

    toEmpty() {
        this.removeChild(this._view);
        this._view = new Graphics();
        this._view.lineStyle(this.borderWidth, this.color);
        this._view.drawRect(0, 0, this.shipWidth, this.shipHeight);
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
}
