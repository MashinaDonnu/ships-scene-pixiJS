import {Container} from "pixi.js";
import {App} from "app";

export interface IAbstractSceneParams {
    name: string;
    app: App;
}

export abstract class AbstractScene extends Container {
    name: string;
    app: App;

    protected constructor({ name, app }: IAbstractSceneParams) {
        super();
        this.name = name;
        this.app = app;
    }
}
