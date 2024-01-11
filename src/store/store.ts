import {IAction} from "store/action.interface";

export type TListenerCb<T, A, P> = (state: T, action: IAction<A, P>) => void
export type TReducerCb<T, A> = (state: T, action: IAction<A>) => T;

export interface IDispatchOptions {
    dispatchEvent?: boolean
}

export class Store<A, T> {

    private _listeners: TListenerCb<T, A, unknown>[] = [];

    constructor(private state: T, public reducer: TReducerCb<T, A>) {}

    subscribe(fn: TListenerCb<T, A, unknown>) {
        this._listeners.push(fn)
        return {
            unsubscribe: () => {
                this._listeners = this._listeners.filter(listener => listener !== fn);
            }
        }
    }

    dispatch<P>(action: IAction<A, P>, options?: IDispatchOptions) {
        this.state = this.reducer(this.state, action);
        if (options?.dispatchEvent !== false) {
            this._listeners.forEach(listener => listener(this.state, action));
        }
    }

    get listeners(): TListenerCb<T, A, unknown>[]  {
        return this._listeners;
    }

    getState() {
        return this.state
    }
}
