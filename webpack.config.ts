import path from "path";
import {ConfigEnv, ConfigPaths} from "./webpack-config/types/config";
import {createConfig} from "./webpack-config/create-config";

export default (env: ConfigEnv) => {

    const mode = env.mode || 'development';
    const PORT = env.port || 3000;
    const isDev = mode === 'development';

    const paths: ConfigPaths = {
        entry: path.resolve(__dirname, 'src', 'index.ts'),
        build: path.resolve(__dirname, 'build'),
        html: path.resolve(__dirname, 'src', 'index.html'),
        src: path.resolve(__dirname, 'src'),
    }

    return createConfig({
        paths,
        isDev,
        mode,
        port: PORT
    });
}

