import {Application, Graphics} from "pixi.js";
import {IApplicationOptions} from "@pixi/app/lib/Application";
import {MainScene} from "scenes/main-scene/main.scene";
import {AbstractScene} from "common/abstract.scene";
import {Store} from "store/store";
import {ERootActions} from "store/root/root-actions.enum";
import {rootState, TRootState} from "store/root/root-state";
import {rootReducer} from "store/root/root-reducer";

export type AppStore = Store<ERootActions, TRootState>

export class App {
    currentScene: AbstractScene;
    config: Partial<IApplicationOptions>;
    pixiApp: Application;
    store = new Store<ERootActions, TRootState>(rootState, rootReducer);

    constructor(config: Partial<IApplicationOptions>) {
        this.pixiApp = new Application(config)
        this.config = config;
    }

    start() {
        this.setCurrentScene(new MainScene({ name: 'main-scene', app: this }));
    }

    setCurrentScene(scene: AbstractScene): void {
        this.pixiApp.stage.removeChild(this.currentScene);
        this.currentScene = scene;
        this.pixiApp.stage.addChild(scene);
    }
}
