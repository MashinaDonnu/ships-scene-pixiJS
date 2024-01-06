import {AbstractObject} from "common/abstract.object";
import {Graphics} from "pixi.js";

export class AbstractShip extends AbstractObject {
    isFilled = false;
    shipWidth = 150;
    shipHeight = 40;
    color = '#000'
    borderWidth = 3;
    private _view: Graphics

    constructor() {
        super();
        this.width = this.shipWidth;
        this.height = this.shipHeight;
        this.position.x = 400
        this.position.y = 400
    }

    generate() {

    }

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
