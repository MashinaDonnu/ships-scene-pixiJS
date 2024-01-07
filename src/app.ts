import {Application} from "pixi.js";
import {IApplicationOptions} from "@pixi/app/lib/Application";
import {MainScene} from "scenes/main-scene/main.scene";
import {AbstractScene} from "common/abstract.scene";

export class App {
    currentScene: AbstractScene;
    config: Partial<IApplicationOptions>;
    pixiApp: Application;

    static $app = this;


    constructor(config: Partial<IApplicationOptions>) {
        this.pixiApp = new Application(config)
        this.config = config;
    }

    start() {
        this.setCurrentScene(new MainScene({ name: 'main-scene', app: this }));
        // this._pixiApp.ticker.add(() => {
        //     console.log('111')
        // })
    }

    setCurrentScene(scene: AbstractScene): void {
        this.pixiApp.stage.removeChild(this.currentScene);
        this.currentScene = scene;
        this.pixiApp.stage.addChild(scene);
    }
}
