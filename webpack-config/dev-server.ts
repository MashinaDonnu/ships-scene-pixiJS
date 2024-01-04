import {ConfigOptions} from "./types/config";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";

export const devServer = (options: ConfigOptions): DevServerConfiguration => {
    const { port, paths } = options;

    return {
        // historyApiFallback: true,
        open: true,
        compress: true,
        hot: true,
        // liveReload: true,
        static: {
            directory: paths.src
            // watch: true
        },
        port,
    }
}
