import {AbstractObject, IAbstractObjectParams} from "common/abstract.object";
import {getPercentValue} from "common/helpers/get-percent-value";
import {Container, Graphics} from "pixi.js";
import {config} from "common/config";
import {PortStationObject} from "scenes/main-scene/objects/port/port-station/port-station.object";
import {IRect} from "common/interfaces/rect.interface";
import {AbstractShip} from "scenes/main-scene/objects/abstract.ship";

export interface IPortObjectParams extends IAbstractObjectParams {}

export class PortObject extends AbstractObject {
    portWidth = getPercentValue(40, config.width);
    entranceHeightPercent = 33.33;
    entranceWidthPercent = 7;
    entranceOffsetTopPercent = 33.33;
    entranceRect: IRect = { x: 0, y: 0, width: 0, height: 0};
    isAllStationsOccupied = false;
    entrance: Graphics;
    entranceCenter: number

    private _stationCount = 4;
    stations: PortStationObject[] = []

    constructor(private params: IPortObjectParams) {
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
        const portCenterX = config.height / 2;
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
            })

            // if (i % 2 === 0) {
            //     station.fill()
            // }

            // station.distance = Math.abs((i - center) * 1000)
            station.distance = Math.abs((i - center + (i >= center ? 1 : 0)) * 1000)

            this.stations.push(station)


            stationsContainer.addChild(station);
        }

        this.stations[1].fill()



        console.log('stations', this.stations.map(s => s.distance))

        this.addChild(stationsContainer);
    }

    getPortEntranceY(): number {
        const { x, y, width, height } = this.entranceRect;
        return (y + (height / 2)) - (config.ship.height / 2)
    }
}
