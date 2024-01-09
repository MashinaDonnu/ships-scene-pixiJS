import {AbstractObject, IAbstractObjectParams} from "common/abstract.object";
import {Graphics} from "pixi.js";
import {IRect} from "common/interfaces/rect.interface";
import {config} from "common/config";

export interface IPortStationObjectParams extends IAbstractObjectParams {
    rect: IRect
}

export class PortStationObject extends AbstractObject {

    private _stationView: Graphics;
    rect: IRect;
    isFilled = false
    distance = 0

    constructor(params: IPortStationObjectParams) {
        super(params);
        this.rect = params.rect;
        const { x, y, width, height } = params.rect;
        const station = new Graphics();
        station.lineStyle(2, 0xFF0000)
        station.drawRect(x, y, width, height)

        this._stationView = station;

        this.addChild(station);
    }

    fill() {
        const { x, y, width, height } = this.rect;
        this.removeChild(this._stationView);
        this._stationView.beginFill(0xFF0000, 1)
        this._stationView.drawRect(x, y, width, height)
        this._stationView.endFill()
        this.addChild(this._stationView);
        this.isFilled = true;
    }
}
