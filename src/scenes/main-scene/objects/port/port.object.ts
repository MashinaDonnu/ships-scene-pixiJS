import {AbstractObject} from "common/abstract.object";
import {getPercentValue} from "common/helpers/get-percent-value";
import {Container, Graphics} from "pixi.js";
import {config} from "common/config";
import {PortStationObject} from "scenes/main-scene/objects/port/port-station/port-station.object";

export class PortObject extends AbstractObject {
    private _stationCount = 4;
    portWidth = getPercentValue(35, config.width);

    constructor() {
        super();
        // const g = new Graphics()
        // g.beginFill('#000', 1)
        // g.drawRect(0, 0, this.portWidth, config.height);
        // g.endFill()
        //
        // this.addChild(g)

        this.generateObstruction();
        this.generateStations();

    }

    generateObstruction() {
        const obstructionWidth = getPercentValue(7, this.portWidth);
        const obstructionHeight = getPercentValue(30, config.height);
        const topObstruction = new Graphics();
        topObstruction.beginFill('#fff')
        topObstruction.drawRect(this.portWidth - obstructionWidth, 0, obstructionWidth, obstructionHeight)
        topObstruction.endFill()


        const bottomObstruction = new Graphics();
        bottomObstruction.beginFill('#fff')
        bottomObstruction.drawRect(this.portWidth - obstructionWidth, config.height - obstructionHeight, obstructionWidth, obstructionHeight)
        bottomObstruction.endFill()

        this.addChild(topObstruction)
        this.addChild(bottomObstruction)
    }

    generateStations() {
        const stationsContainer = new Container();
        const stationWidth = getPercentValue(15, this.portWidth);
        const stationHeight = getPercentValue(20, config.height);
        const arr: any[] = []

        for (let i = 0; i < this._stationCount; i++) {
            const station = new PortStationObject({
                x: 0,
                y: i * (stationHeight + 10),
                width: stationWidth,
                height: stationHeight
            })

            arr.push(station)


            stationsContainer.addChild(station);
        }


        setTimeout(() => {
            arr[1].fill();
        }, 3000)

        this.addChild(stationsContainer);
    }
}
