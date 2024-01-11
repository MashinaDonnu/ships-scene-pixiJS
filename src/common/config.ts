export const config = {
    width: 1000,
    height: 800,

    ship: {
        width: 100,
        height: 40
    },

    time: {
        shipGeneration: 2000,
        shipToPort: 3000,
        shipFromPort: 3000,
        shipFromQueueToPort: 1000,
        shipToStationRotation: 100,
        shipToStation: 1000,
        shipFromStation: 1000,
        shipToPortEntrance: 1000,
        shipMovingInQueue: 1000
    },

    port: {
        widthPercentage: 40,
        entranceHeightPercentage: 33.33,
        entranceWidthPercentage: 7,
        entranceOffsetTopPercentage: 33.33
    }
}
