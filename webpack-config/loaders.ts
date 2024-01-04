import webpack from 'webpack';
import {ConfigOptions} from "./types/config";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export const loaders = (options: ConfigOptions): webpack.RuleSetRule[] => {

    const { isDev } = options;

    const svg: webpack.RuleSetRule = {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
    };

    const file: webpack.RuleSetRule = {
        test: /\.(png|jpe?g|gif|woff|woff2)$/i,
        use: [
            {
                loader: 'file-loader',
            },
        ],
    };

    const styles: webpack.RuleSetRule = {
        test: /\.s[ac]ss$/i,
        use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        auto: (resPath: string) => Boolean(resPath.includes('.module.')),
                        localIdentName: isDev
                            ? '[path][name]__[local]--[hash:base64:5]'
                            : '[hash:base64:8]',
                    },
                },
            },
            'sass-loader',
        ],
    };

    const typescript: webpack.RuleSetRule = {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
    };

    return [
        file,
        svg,
        typescript,
        styles,
    ];
}
