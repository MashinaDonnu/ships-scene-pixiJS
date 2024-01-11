export const config = {
    width: 1000,
    height: 800,

    colors: {
        blue: '#244ae3',
        yellow: '#ebd61e',
        red: '#e62825',
        green: '#34ba4a'
    },

    ship: {
        width: 100,
        height: 40,
        borderWidth: 5
    },

    time: {
        shipGeneration: 8000,
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
        entranceWidthPercentage: 4,
        entranceOffsetTopPercentage: 33.33
    },

    station: {
        widthPercentage: 15,
        heightPercentage: 23.5,
        borderWidth: 10
    }
};
