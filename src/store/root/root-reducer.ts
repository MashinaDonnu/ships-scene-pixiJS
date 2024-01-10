import {rootState, TRootState} from "store/root/root-state";
import {IAction} from "store/action.interface";
import {ERootActions} from "store/root/root-actions.enum";

export function rootReducer(state: TRootState, action: IAction<ERootActions, any>): TRootState {
    switch (action.type) {
        case ERootActions.test: {
            return { ...state, hello: 'bazzz' }
        }

        case ERootActions.generateShip: {
            return { ...state, generatedShipsQueue: [...state.generatedShipsQueue, action.payload] }
        }

        case ERootActions.removeFromGeneratedQueue: {
            return { ...state, generatedShipsQueue: state.generatedShipsQueue.filter(s => s !== action.payload)  }
        }

        case ERootActions.moveToCollectorShipsQueue: {
            return { ...state, collectorShipsQueue: [...state.collectorShipsQueue, action.payload] }
        }

        case ERootActions.removeFromCollectorShipsQueue: {
            return { ...state, collectorShipsQueue: state.collectorShipsQueue.filter(s => s !== action.payload) }
        }

        case ERootActions.moveToLoadedShipsQueue: {
            return { ...state, loadedShipsQueue: [...state.loadedShipsQueue, action.payload] }
        }

        case ERootActions.removeFromLoadedShipsQueue: {
            return { ...state, loadedShipsQueue: state.loadedShipsQueue.filter(s => s !== action.payload) }
        }

        case ERootActions.moveShipToAllShipsQueue: {
            return { ...state, allShipsQueue: [...state.allShipsQueue, action.payload] }
        }

        case ERootActions.removeShipFromAllShipsQueue: {
            return { ...state, allShipsQueue: state.allShipsQueue.filter(s => s !== action.payload) }
        }

        case ERootActions.moveShipToPort: {
            return { ...state, shipsInPort: [...state.shipsInPort, action.payload] }
        }

        case ERootActions.removeShipFromPort: {
            return { ...state, shipsInPort: state.shipsInPort.filter(s => s !== action.payload) }
        }
    }
}
