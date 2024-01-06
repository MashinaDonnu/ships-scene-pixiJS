import {AbstractObject} from "common/abstract.object";
import {Graphics} from "pixi.js";
import {config} from "common/config";

export class SeeObject extends AbstractObject {
    constructor() {
        super();
        const see = new Graphics();
        see.beginFill('#1c85bd', 1);
        see.drawRect(0, 0, config.width, config.height);
        see.endFill();

        this.addChild(see)
    }
}
