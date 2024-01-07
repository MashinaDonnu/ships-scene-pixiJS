import {AbstractShip} from "scenes/main-scene/objects/abstract.ship";
import {CollectorShipObject} from "scenes/main-scene/objects/collector-ship/collector-ship.object";
import {LoadedShipObject} from "scenes/main-scene/objects/loaded-ship/loaded-ship.object";

export type TRootState = typeof rootState;

export const rootState = {
    hello: 'worlddd',
    generatedShipsQueue: <AbstractShip[]>[],
    collectorShipsQueue: <CollectorShipObject[]>[],
    loadedShipsQueue: <LoadedShipObject[]>[],
}
