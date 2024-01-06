import {Container} from "pixi.js";
import {App} from "app";

export abstract class AbstractScene extends Container {
    name: string;
    $app =  App.$app;

    protected constructor(name: string) {
        super();
        this.name = name;
    }
}
