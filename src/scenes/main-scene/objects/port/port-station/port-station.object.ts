import {AbstractObject} from "common/abstract.object";
import {Graphics} from "pixi.js";
import {IRect} from "common/interfaces/rect.interface";

export class PortStationObject extends AbstractObject {

    private _stationView: Graphics;
    rect: IRect;

    constructor(rect: IRect) {
        super();
        this.rect = rect;
        const { x, y, width, height } = rect;
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
    }
}
