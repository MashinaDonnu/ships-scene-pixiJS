import {rootState} from "store/root/root-state";
import {IAction} from "store/action.interface";
import {ERootActions} from "store/root/root-actions.enum";

export function rootReducer(state: typeof rootState, action: IAction<ERootActions, null>) {
    switch (action.type) {
        case ERootActions.test: {
            return {...state, hello: 'bazzz'}
        }
    }
}
