import {ConfigOptions} from "./types/config";
import webpack from "webpack";

export const resolvers = (options: ConfigOptions): webpack.ResolveOptions  => {
    const { paths } = options;

    return {
        extensions: ['.tsx', '.ts', '.js'],
        preferAbsolute: true,
        modules: [paths.src, 'node_modules'],
        mainFiles: ['index'],
        alias: {},
    };
}
