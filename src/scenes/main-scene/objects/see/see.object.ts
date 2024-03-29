import {AbstractObject, IAbstractObjectParams} from "common/abstract.object";
import {Graphics} from "pixi.js";
import {config} from "common/config";

export interface ISeeObjectParams extends IAbstractObjectParams {}

export class SeeObject extends AbstractObject {
    color = config.colors.blue;

    constructor(params: ISeeObjectParams) {
        super(params);
        const see = new Graphics();
        see.beginFill(this.color, 1);
        see.drawRect(0, 0, config.width, config.height);
        see.endFill();
        this.addChild(see);
    }
}
