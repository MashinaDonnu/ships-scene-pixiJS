import {Container} from "pixi.js";
import {AbstractScene} from "common/abstract.scene";

export interface IAbstractObjectParams {
    name: string;
    scene: AbstractScene;
}

export abstract class AbstractObject extends Container {
    name: string;
    scene: AbstractScene;

    protected constructor({ name, scene }: IAbstractObjectParams) {
        super()
        this.name = name;
        this.scene = scene;
    }

}
