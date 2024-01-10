export enum ERootActions {
    test,
    generateShip = 'generateShip',
    removeFromGeneratedQueue = 'removeFromGeneratedQueue',
    moveToCollectorShipsQueue = 'moveToCollectorShipsQueue',
    removeFromCollectorShipsQueue = 'removeFromCollectorShipsQueue',
    moveToLoadedShipsQueue = 'moveToLoadedShipsQueue',
    removeFromLoadedShipsQueue = 'removeFromLoadedShipsQueue',
    moveShipToAllShipsQueue = 'moveShipToAllShipsQueue',
    removeShipFromAllShipsQueue = 'removeShipFromAllShipsQueue',
    moveShipToPort = 'moveToPort',
    removeShipFromPort = 'removeFromPort'
}
