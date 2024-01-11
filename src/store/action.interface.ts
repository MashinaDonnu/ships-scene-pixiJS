export interface IAction<T = string, P = unknown> {
    type: T;
    payload?: P;
}
