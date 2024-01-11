import {App} from "app";
import {config} from "common/config";

const app = new App({
    view: document.getElementById('playground') as any,
    background: '#ccc',
    width: config.width,
    height: config.height
})

app.start()


