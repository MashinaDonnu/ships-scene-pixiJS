import {AbstractObject, IAbstractObjectParams} from "common/abstract.object";
import {Graphics} from "pixi.js";
import {IRect} from "common/interfaces/rect.interface";
import {config} from "common/config";

export interface IPortStationObjectParams extends IAbstractObjectParams {
    rect: IRect
}

export class PortStationObject extends AbstractObject {
    rect: IRect;
    isFilled = false;
    reserved = false;
    distance = 0;
    centerX: number;
    centerY: number;

    private _stationView: Graphics;

    constructor(params: IPortStationObjectParams) {
        super(params);
        this.rect = params.rect;
        const { x, y, width, height } = params.rect;
        this.centerY  = y + height / 2;
        this.centerX  = this.centerY + width;
        this.toEmpty();
    }

    fill(): void {
        const { x, y, width, height } = this.rect;
        this.removeChild(this._stationView);
        this._stationView = new Graphics();
        this._stationView.beginFill(0xFF0000, 1)
        this._stationView.drawRect(x, y, width, height)
        this._stationView.endFill()
        this.addChild(this._stationView);
        this.isFilled = true;
    }

    toEmpty(): void {
        const { x, y, width, height } = this.rect;
        this.removeChild(this._stationView);
        this._stationView = new Graphics();
        this._stationView.beginFill(0xFF0000, 0)
        this._stationView.lineStyle(2, 0xFF0000)
        this._stationView.drawRect(x, y, width, height)
        this.addChild(this._stationView);
        this.isFilled = false;
    }
}
