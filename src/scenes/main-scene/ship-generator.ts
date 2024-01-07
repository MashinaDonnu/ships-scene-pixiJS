import {MainScene} from "scenes/main-scene/main.scene";
import {PortObject} from "scenes/main-scene/objects/port/port.object";
import {config} from "common/config";
import {AbstractShip} from "scenes/main-scene/objects/abstract.ship";
import {LoadedShipObject} from "scenes/main-scene/objects/loaded-ship/loaded-ship.object";
import {IRect} from "common/interfaces/rect.interface";
import {CollectorShipObject} from "scenes/main-scene/objects/collector-ship/collector-ship.object";

export class ShipGenerator {
    port: PortObject;

    constructor(private scene: MainScene) {
        this.port = scene.port;
    }

    generate(): AbstractShip {
        const offsetY = this.getPortEntranceY();
        return this.getRandomShip({
            x: config.width,
            y: offsetY,
        })
    }

    getPortEntranceY(): number {
        const { x, y, width, height } = this.port.entranceRect;
        return (y + (height / 2)) - (config.ship.height / 2)
    }

    getRandomShip(rect: IRect): AbstractShip {
        const random = Math.floor(Math.random() * 2) + 1;

        switch (random) {
            case 1: {
               return new LoadedShipObject({
                   name: 'loaded-ship',
                   scene: this.scene,
                   rect
               })
            }

            case 2: {
                return new CollectorShipObject({
                    name: 'collector-ship',
                    scene: this.scene,
                    rect
                })
            }
        }
    }
}
