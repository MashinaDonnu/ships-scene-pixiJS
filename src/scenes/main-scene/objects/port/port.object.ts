import {AbstractObject, IAbstractObjectParams} from "common/abstract.object";
import {getPercentValue} from "common/helpers/get-percent-value";
import {Container, Graphics} from "pixi.js";
import {config} from "common/config";
import {PortStationObject} from "scenes/main-scene/objects/port/port-station/port-station.object";
import {IRect} from "common/interfaces/rect.interface";

export interface IPortObjectParams extends IAbstractObjectParams {}

export class PortObject extends AbstractObject {
    portWidth = getPercentValue(40, config.width);
    entranceHeightPercent = 33.33;
    entranceWidthPercent = 7;
    entranceOffsetTopPercent = 33.33;
    entranceCenter: number;

    private _entranceRect: IRect = { x: 0, y: 0, width: 0, height: 0};
    private _entrance: Graphics;
    private _stationCount = 4;
    private _stations: PortStationObject[] = [];

    constructor(params: IPortObjectParams) {
        super(params);
        this.width = this.portWidth;
        this.generateEntrance();
        this.generateStations();
        this.entranceCenter = this.getPortEntranceY();

    }

    generateEntrance(): void {
         const width = getPercentValue(this.entranceWidthPercent, this.portWidth);
         const height= getPercentValue(this.entranceHeightPercent, config.height);
         const offsetTop = getPercentValue(this.entranceOffsetTopPercent, config.height);
         const entranceOffset = this.portWidth - width;


         this.entranceRect.x = entranceOffset;
         this.entranceRect.y = offsetTop;
         this.entranceRect.width = width;
         this.entranceRect.height = height;

         const entrance = new Graphics();
         this._entrance = entrance;
         entrance.beginFill('#1c85bd', 1)
         entrance.drawRect(entranceOffset, offsetTop, width, height);
         entrance.endFill();
         this.addChild(entrance);
         this.generateObstruction({
             x: entranceOffset,
             y: 0,
             width,
             height: offsetTop
         })

        this.generateObstruction({
            x: entranceOffset,
            y: offsetTop + height,
            width,
            height: config.height - (offsetTop + height)
        })
    }

    generateObstruction(rect: IRect) {
        const { x, y, width, height } = rect;
        const obstruction = new Graphics();
        obstruction.beginFill('#fff', 1);
        obstruction.drawRect(x, y, width, height);
        obstruction.endFill();
        this.addChild(obstruction);
    }

    generateStations() {
        const stationsContainer = new Container();
        const stationWidth = getPercentValue(15, this.portWidth);
        const stationHeight = getPercentValue(23.5, config.height);
        const center = Math.floor(this._stationCount / 2);

        for (let i = 0; i < this._stationCount; i++) {
            const station = new PortStationObject({
                name: 'port-station' + i,
                scene: this.scene,
                rect: {
                    x: 0,
                    y: i * (stationHeight + 10),
                    width: stationWidth,
                    height: stationHeight
                }
            });

            station.distance = Math.abs((i - center + (i >= center ? 1 : 0)) * 1000)
            this.stations.push(station)
            stationsContainer.addChild(station);
        }

        this.addChild(stationsContainer);
    }

    getPortEntranceY(): number {
        const { x, y, width, height } = this.entranceRect;
        return (y + (height / 2)) - (config.ship.height / 2)
    }

    get stations() {
        return this._stations;
    }

    get entranceRect() {
        return this._entranceRect;
    }

    get entrance() {
        return this._entrance;
    }
}
