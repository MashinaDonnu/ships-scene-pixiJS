import {AbstractObject, IAbstractObjectParams} from "common/abstract.object";
import {getPercentValue} from "common/helpers/get-percent-value";
import {Container, Graphics} from "pixi.js";
import {config} from "common/config";
import {PortStationObject} from "scenes/main-scene/objects/port/port-station/port-station.object";
import {IRect} from "common/interfaces/rect.interface";
import {AbstractShip} from "scenes/main-scene/objects/abstract.ship";

export interface IPortObjectParams extends IAbstractObjectParams {}

export class PortObject extends AbstractObject {
    portWidth = getPercentValue(35, config.width);
    entranceHeightPercent = 33.33;
    entranceWidthPercent = 7;
    entranceOffsetTopPercent = 33.33;
    entranceRect: IRect = { x: 0, y: 0, width: 0, height: 0};
    isAllPiersOccupied = false;
    entrance: Graphics;

    private _stationCount = 4;
    stations: PortStationObject[] = []

    constructor(private params: IPortObjectParams) {
        super(params);
        this.width = this.portWidth;
        this.generateEntrance();
        this.generateStations();

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
         this.entrance = entrance;
         // entrance.beginFill('#ccc', 1);
        // entrance.position.x = this.entranceRect.x;
        // entrance.position.y = this.entranceRect.y;
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
        const stationHeight = getPercentValue(20, config.height);

        for (let i = 0; i < this._stationCount; i++) {
            const station = new PortStationObject({
                name: 'port-station',
                scene: this.scene,
                rect: {
                    x: 0,
                    y: i * (stationHeight + 10),
                    width: stationWidth,
                    height: stationHeight
                }
            })

            this.stations.push(station)


            stationsContainer.addChild(station);
        }

        this.addChild(stationsContainer);
    }
}
