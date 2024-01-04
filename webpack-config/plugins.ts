import HTMLWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import webpack from "webpack";
import {ConfigOptions} from "./types/config";

export const plugins = (options: ConfigOptions) => {
    const { isDev, paths } = options;

    return [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[contenthash:8].css',
        }),
        new HTMLWebpackPlugin({
            template: paths.html,
        }),
        new webpack.ProgressPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ];
}
