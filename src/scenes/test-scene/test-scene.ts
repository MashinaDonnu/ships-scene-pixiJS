import {AbstractScene} from "common/abstract.scene";
import {Graphics} from "pixi.js";

export class TestScene extends AbstractScene {
    constructor() {
        super('test-scene');
        const m = new Graphics()
        m.beginFill('#000', 1)
        m.drawCircle(0, 0, 10)
        m.endFill()
        m.position.set(100, 100)
        this.addChild(m)
    }
}
