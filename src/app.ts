import {Application} from "pixi.js";
import {IApplicationOptions} from "@pixi/app/lib/Application";
import {MainScene} from "scenes/main-scene/main.scene";
import {AbstractScene} from "common/abstract.scene";

export class App {
    currentScene: AbstractScene;
    config: Partial<IApplicationOptions>;
    static $app = this;

    private _pixiApp: Application;

    constructor(config: Partial<IApplicationOptions>) {
        this._pixiApp = new Application(config)
        this.config = config;
    }

    start() {

       // for (const object of this.config.objects) {
       //     root.addChild(object.view)
       // }

        // const marker = new Graphics();
        // marker.beginFill('#000', 1)
        // marker.drawCircle(0, 0, 5)
        // marker.endFill()
        // marker.position.set(100, 100)

        this.setCurrentScene(new MainScene())
    }

    setCurrentScene(scene: AbstractScene): void {
        this._pixiApp.stage.removeChild(this.currentScene);
        this.currentScene = scene;
        this._pixiApp.stage.addChild(scene);
    }
}
