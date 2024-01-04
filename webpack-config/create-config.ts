import {ConfigOptions} from "./types/config";
import { Configuration } from "webpack";
import {plugins} from "./plugins";
import {loaders} from "./loaders";
import {resolvers} from "./resolvers";
import {devServer} from "./dev-server";

export const createConfig = (options: ConfigOptions): Configuration => {
    const { mode, paths, isDev } = options;

    return {
        entry: paths.entry,
        mode,
        devServer: isDev ? devServer(options) : undefined,
        devtool: isDev ? 'inline-source-map' : undefined,
        output: {
            filename: '[name].[contenthash].js',
            path: paths.build,
            clean: true,
        },
        plugins: plugins(options),
        module: {
            rules: loaders(options)
        },
        resolve: resolvers(options),
    }

}
