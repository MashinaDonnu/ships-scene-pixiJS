import {IAction} from "store/action.interface";

export type TListenerCb<T> = (state: T) => void
export type TReducerCb<T, A> = (state: T, action: IAction<A>) => T;

export class Store<A, T> {

    private _listeners: TListenerCb<T>[] = [];

    constructor(private state: T, public reducer: TReducerCb<T, A>) {}

    subscribe(fn: TListenerCb<T>) {
        this._listeners.push(fn)
        return {
            unsubscribe: () => {
                this._listeners = this._listeners.filter(listener => listener !== fn);
            }
        }
    }

    dispatch<P>(action: IAction<A, P>) {
        this.state = this.reducer(this.state, action);
        this._listeners.forEach(listener => listener(this.state));
    }

    get listeners(): TListenerCb<T>[]  {
        return this._listeners;
    }

    getState() {
        return JSON.parse(JSON.stringify(this.state))
    }
}
