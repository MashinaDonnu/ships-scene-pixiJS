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

        case ERootActions.moveToCollectorShipsQueue: {
            return { ...state, collectorShipsQueue: [...state.collectorShipsQueue, action.payload] }
        }

        case ERootActions.moveToLoadedShipsQueue: {
            return { ...state, loadedShipsQueue: [...state.loadedShipsQueue, action.payload] }
        }
    }
}
