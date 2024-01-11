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
        // this._pixiApp.ticker.add(() => {
        //     console.log('111')
        // })

        // const spinner = new Graphics();
        // spinner.beginFill(0xFFFFFF); // Fill color
        // spinner.drawRect(0, 0, 50, 100); // Draw a rectangle
        // spinner.endFill();
        // spinner.pivot.set(25, 50); // Set pivot to the center of the rectangle
        // spinner.position.x = 200
        // spinner.position.y = 200
        // // spinner.x = this.pixiApp.screen.width / 2;
        // // spinner.y = this.pixiApp.screen.height / 2;
        // this.pixiApp.stage.addChild(spinner);
        // console.log(11111, spinner.position)
        //
        // this.pixiApp.ticker.add(() => {
        //     // Rotate the spinner
        //     spinner.rotation += 0.05;
        // });
    }

    setCurrentScene(scene: AbstractScene): void {
        this.pixiApp.stage.removeChild(this.currentScene);
        this.currentScene = scene;
        this.pixiApp.stage.addChild(scene);
    }
}
